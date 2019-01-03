using System;
using System.Collections.Generic;
using System.Data;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using MongoDB.Bson.Serialization;
using MongoDB.Bson.Serialization.IdGenerators;
using MongoDB.Driver;
using YogurtTheBlog.Models;

namespace YogurtTheBlog.Repositories {
    public class PostsRepository {
        private readonly IMongoCollection<Post> _postsCollection;

        public PostsRepository(IMongoDatabase database) {
            BsonClassMap.RegisterClassMap<Post>(cm => {
                cm.AutoMap();
                cm.MapIdProperty(p => p.ConstantUrl).SetIdGenerator(StringObjectIdGenerator.Instance);
            });

            _postsCollection = database.GetCollection<Post>("posts");
            // Add index
        }

        public async Task<Page<Post>> GetPosts(int page, int pageSize, string tag=null) {
            if (page < 1) {
                throw new ArgumentOutOfRangeException(nameof(page), "Page must be greater than 0");
            }

            if (pageSize < 1) {
                throw new ArgumentOutOfRangeException(nameof(pageSize), "Page size must be greater than 0");
            }

            IFindFluent<Post, Post> posts = _postsCollection
                .Find(tag is null ? FilterDefinition<Post>.Empty : Builders<Post>.Filter.AnyEq(p => p.Tags, tag))
                .Sort(new SortDefinitionBuilder<Post>().Descending(p => p.PublishDate));

            return new Page<Post> {
                PagesCount = await posts.CountDocumentsAsync(),
                PageNumber = page,
                Elements = await posts.Skip((page - 1) * pageSize).Limit(pageSize).ToListAsync(),
                PageSize = pageSize
            };
        }

        public async Task<Post> GetPost(string postUrl) {
            return await _postsCollection.Find(CreateFilterByUrl(postUrl)).FirstAsync();
        }

        private static FilterDefinition<Post> CreateFilterByUrl(string postUrl) {
            return new FilterDefinitionBuilder<Post>().Eq("_id", postUrl);
        }

        public async Task AddPost(Post post) {
            try {
                await _postsCollection.InsertOneAsync(post);
            }
            catch (MongoWriteException) {
                throw new DuplicateNameException($"Post with name {post.ConstantUrl} already exists");
            }
        }

        public async Task DeletePost(string postUrl) {
            try {
                await _postsCollection.DeleteOneAsync(CreateFilterByUrl(postUrl));
            }
            catch (MongoCursorNotFoundException) {
                throw new KeyNotFoundException();
            }
        }

        public async Task UpdatePost(Post post) {
            await _postsCollection.ReplaceOneAsync(
                CreateFilterByUrl(post.ConstantUrl),
                post,
                new UpdateOptions {
                    IsUpsert = true
                }
            );
        }
    }
}
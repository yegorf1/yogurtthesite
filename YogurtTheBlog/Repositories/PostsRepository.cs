using System;
using System.Threading.Tasks;
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
                cm.MapIdProperty(p => p.ConstantUri).SetIdGenerator(StringObjectIdGenerator.Instance);
            });

            _postsCollection = database.GetCollection<Post>("posts");
            // Add index
        }

        public async Task<Page<Post>> GetPosts(int page, int pageSize) {
            if (page < 1) {
                throw new ArgumentOutOfRangeException(nameof(page), "Page must be greater than 0");
            }

            if (pageSize < 1) {
                throw new ArgumentOutOfRangeException(nameof(pageSize), "Page size must be greater than 0");
            }
            
            IFindFluent<Post, Post> posts = _postsCollection.Find(FilterDefinition<Post>.Empty);
            return new Page<Post> {
                PagesCount = await posts.CountDocumentsAsync(),
                PageNumber = page,
                Elements = await posts.Skip((page - 1) * pageSize).Limit(pageSize).ToListAsync(),
                PageSize = pageSize
            };
        }
    }
}
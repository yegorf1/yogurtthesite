using System.Collections.Generic;
using System.Threading.Tasks;
using MongoDB.Bson.Serialization;
using MongoDB.Bson.Serialization.Serializers;
using MongoDB.Driver;
using YogurtTheBlog.Models;

namespace YogurtTheBlog.Repositories {
    public interface IPublishersRepository {
        Task<IEnumerable<Publisher>> GetPublishers();
        Task AddPublisher(Publisher p);
        Task DeletePublisher(string name);

    }
    
    public class MongoPublishersRepository : IPublishersRepository {
        private readonly IMongoCollection<Publisher> _publishers;

        public MongoPublishersRepository(IMongoDatabase database) {
            BsonClassMap.RegisterClassMap<Publisher>(cm => {
                cm.AutoMap();
                cm.MapIdProperty(p => p.Name).SetSerializer(new StringSerializer());
                cm.GetMemberMap(p => p.PublisherType).SetSerializer(new StringSerializer());
            });

            _publishers = database.GetCollection<Publisher>("publishers");
        }

        public async Task<IEnumerable<Publisher>> GetPublishers() {
            return (await _publishers.FindAsync(FilterDefinition<Publisher>.Empty)).ToEnumerable();
        }

        public async Task AddPublisher(Publisher p) {
            await _publishers.InsertOneAsync(p);
        }

        public async Task DeletePublisher(string name) {
            await _publishers.DeleteOneAsync(Builders<Publisher>.Filter.Eq(p => p.Name, name));
        }
    }
}
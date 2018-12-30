using System;
using System.Collections.Generic;
using System.Data;
using System.Linq;
using System.Security.Cryptography;
using System.Text;
using System.Threading.Tasks;
using Microsoft.Extensions.Logging;
using MongoDB.Bson.Serialization;
using MongoDB.Bson.Serialization.Serializers;
using MongoDB.Driver;
using YogurtTheBlog.Models;

namespace YogurtTheBlog.Repositories {
    public interface IUsersRepository
    {
        Task<User> Authenticate(string username, string password);
        Task<User> GetById(string username);
        Task<User> Create(User user, string password);
        Task Update(User user, string password = null);
        Task Delete(string username);
    }
    
    public class UsersRepository : IUsersRepository {
        private readonly IMongoCollection<User> _users;
        private readonly ILogger<UsersRepository> _logger;

        public UsersRepository(ILogger<UsersRepository> logger, IMongoDatabase database) {
            BsonClassMap.RegisterClassMap<User>(cm => {
                cm.AutoMap();
                cm.MapIdProperty(u => u.Username).SetSerializer(new StringSerializer());
            });
            
            _logger = logger;
            _users = database.GetCollection<User>("users");
        }
        
        public async Task<User> Authenticate(string username, string password) {
            if (string.IsNullOrEmpty(username) || string.IsNullOrEmpty(password))
                return null;

            User user = await _users.Find(FilterByUserName(username)).FirstOrDefaultAsync();

            if (user == null) {
                return null;
            }

            return !VerifyPasswordHash(password, user.PasswordHash, user.PasswordSalt) ? null : user;
        }

        private bool VerifyPasswordHash(string password, byte[] storedHash, byte[] storedSalt) {
            if (password == null) throw new ArgumentNullException(nameof(password));
            if (string.IsNullOrWhiteSpace(password)) throw new ArgumentException("Value cannot be empty or whitespace only string.", nameof(password));
            if (storedHash.Length != 64) throw new ArgumentException("Invalid length of password hash (64 bytes expected).", nameof(password));
            if (storedSalt.Length != 128) throw new ArgumentException("Invalid length of password salt (128 bytes expected).", nameof(storedSalt));
                
            using (var hmac = new HMACSHA512(storedSalt)) {
                byte[] computedHash = hmac.ComputeHash(System.Text.Encoding.UTF8.GetBytes(password));
                if (computedHash.Where((t, i) => t != storedHash[i]).Any()) {
                    return false;
                }
            }

            return true;
        }
        
        private static void CreatePasswordHash(string password, out byte[] passwordHash, out byte[] passwordSalt)
        {
            if (password == null) throw new ArgumentNullException(nameof(password));
            if (string.IsNullOrWhiteSpace(password)) throw new ArgumentException("Value cannot be empty or whitespace only string.", nameof(password));

            using (var hmac = new HMACSHA512())
            {
                passwordSalt = hmac.Key;
                passwordHash = hmac.ComputeHash(Encoding.UTF8.GetBytes(password));
            }
        }

        private static FilterDefinition<User> FilterByUserName(string username) {
            return new FilterDefinitionBuilder<User>().Eq(u => u.Username, username);
        }

        public async Task<User> GetById(string username) {
            return await _users.Find(FilterByUserName(username)).FirstOrDefaultAsync();
        }

        public async Task<User> Create(User user, string password) {
            if (string.IsNullOrWhiteSpace(password))
                throw new ArgumentNullException(nameof(password));

            if (await _users.Find(FilterByUserName(user.Username)).CountDocumentsAsync() > 0)
                throw new DuplicateNameException($"Username \"{user.Username}\" is already taken");

            CreatePasswordHash(password, out byte[] passwordHash, out byte[] passwordSalt);

            user.PasswordHash = passwordHash;
            user.PasswordSalt = passwordSalt;

            await _users.InsertOneAsync(user);
            
            return user;
        }

        public async Task Update(User userParam, string password = null) {
            if (!string.IsNullOrWhiteSpace(password))
            {
                CreatePasswordHash(password, out byte[] passwordHash, out byte[] passwordSalt);

                await _users.FindOneAndUpdateAsync(
                    FilterByUserName(userParam.Username),
                    new UpdateDefinitionBuilder<User>()
                        .Set(u => u.PasswordHash, passwordHash)
                        .Set(u => u.PasswordSalt, passwordSalt)
                );
            }

        }

        public async Task Delete(string username) {
            await _users.DeleteOneAsync(FilterByUserName(username));
        }
    }
}
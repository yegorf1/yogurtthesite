using System.Collections.Generic;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using YogurtTheBlog.Models;
using YogurtTheBlog.Repositories;

namespace YogurtTheBlog.Controllers {
    [Authorize(Roles = "Admin")]
    [Route("api/{controller}")]
    public class PublishersController : Controller {
        private readonly IPublishersRepository _publishers;

        public PublishersController(IPublishersRepository publishers) {
            _publishers = publishers;
        }

        [HttpGet]
        public async Task<IEnumerable<Publisher>> GetPublishers() {
            return await _publishers.GetPublishers();
        }

        [HttpPost]
        public async Task CreatePublisher([FromBody] Publisher publisher) {
            await _publishers.AddPublisher(publisher);
        }

        [HttpDelete("{name}")]
        public async Task DeletePublisher(string name) {
            await _publishers.DeletePublisher(name);
        }
    }
}
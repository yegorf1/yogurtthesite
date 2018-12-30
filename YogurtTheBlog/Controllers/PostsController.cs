using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;
using YogurtTheBlog.Models;
using YogurtTheBlog.Repositories;

namespace YogurtTheBlog.Controllers {
    [Route("api/[controller]")]
    public class PostsController : Controller{
        private readonly PostsRepository _posts;
        private readonly ILogger<PostsController> _logger;

        public PostsController(PostsRepository posts, ILogger<PostsController> logger) {
            _posts = posts;
            _logger = logger;
        }
       
        [HttpGet]
        public async Task<ActionResult<Page<Post>>> PagedPostsAsync([FromQuery]int? page, [FromQuery]int? pageSize) {
            try {
                return await _posts.GetPosts(page ?? 1, pageSize ?? 15);
            }
            catch (ArgumentOutOfRangeException ex) {
                // add bad request
                throw;
            }
        }
    }
}
using System;
using System.Collections.Generic;
using System.Data;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Authorization;
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

        [HttpGet("{postUrl}")]
        public async Task<ActionResult<Post>> GetPostAsync(string postUrl) {
            return await _posts.GetPost(postUrl);
        }
        
        [Authorize(Roles = "Admin")]
        [HttpPost]
        public async Task<IActionResult> CreatePost([FromBody] Post post) {
            post.PublishDate = DateTime.Now;
            post.Author = User.Identity.Name;
            try {
                await _posts.AddPost(post);
                return Ok(post);
            }
            catch (DuplicateNameException ex) {
                return BadRequest(new {
                    message = ex.Message
                });
            }
        }

        [Authorize(Roles = "Admin")]
        [HttpDelete("{postUrl}")]
        public async Task<IActionResult> DeletePost(string postUrl) {
            try {
                await _posts.DeletePost(postUrl);

                return Ok();
            }
            catch (KeyNotFoundException ex) {
                return BadRequest(new {
                    message = ex.Message
                });
            }
        }
    }
}
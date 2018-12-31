using System;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;
using Microsoft.Extensions.Options;
using Microsoft.IdentityModel.Tokens;
using YogurtTheBlog.Dtos;
using YogurtTheBlog.Models;
using YogurtTheBlog.Repositories;

namespace YogurtTheBlog.Controllers {
    [Authorize]
    [Route("{controller}")]
    public class AuthController : Controller {
        private readonly IUsersRepository _usersRepository;
        private readonly ILogger<AuthController> _logger;
        private readonly AuthSettings _authSettings;

        public AuthController(ILogger<AuthController> logger, IUsersRepository users, IOptions<AuthSettings> authSettings) {
            _usersRepository = users;
            _logger = logger;
            _authSettings = authSettings.Value;
        }

        [AllowAnonymous]
        [HttpPost("authenticate")]
        public async Task<IActionResult> AuthenticateAsync([FromBody] UserDto userDto) {
            User user = await _usersRepository.Authenticate(userDto.Username, userDto.Password);

            if (user is null) {
                return BadRequest(new {message = "Username or password mismatch"});
            }

            var tokenHandler = new JwtSecurityTokenHandler();
            byte[] key = Encoding.ASCII.GetBytes(_authSettings.Secret);
            var tokenDescriptor = new SecurityTokenDescriptor {
                Subject = new ClaimsIdentity(new Claim[] {
                    new Claim(ClaimTypes.Name, user.Username)
                }),
                Expires = DateTime.UtcNow.AddDays(7),
                SigningCredentials = new SigningCredentials(new SymmetricSecurityKey(key),
                    SecurityAlgorithms.HmacSha256Signature)
            };

            SecurityToken token = tokenHandler.CreateToken(tokenDescriptor);
            string tokenString = tokenHandler.WriteToken(token);

            return Ok(new {
                user.Username,
                user.IsAdmin,
                Token = tokenString
            });
        }

        [AllowAnonymous]
        [HttpPost("register")]
        public async Task<IActionResult> RegisterAsync([FromBody] UserDto userDto) {
            var user = new User {
                Username = userDto.Username
            };

            try {
                await _usersRepository.Create(user, userDto.Password);
                return Ok();
            }
            catch (Exception ex) {
                return BadRequest(new {message = ex.Message});
            }
        }
    }
}
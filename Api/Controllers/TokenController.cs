using Api.ViewModels.Token;
using Common.Entities;
using Common.Reposotories;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Configuration;
using Microsoft.IdentityModel.Tokens;
using System;
using System.Collections.Generic;
using System.IdentityModel.Tokens.Jwt;
using System.Linq;
using System.Security.Claims;
using System.Text;

namespace Api.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class TokenController : ControllerBase
    {
        private readonly UserManagementDbContext _dbContext;
        private readonly IConfiguration _configuration;
        public TokenController(UserManagementDbContext dbContext, IConfiguration configuration)
        {
            _dbContext = dbContext;
            _configuration = configuration;
        }
        [HttpPut]
        [Route("Login")]
        public IActionResult Login([FromBody] LoginVM model)
        {
            User loggedUser = _dbContext.Users.Where(u => u.Username == model.Username
                                                  && u.Password == model.Password).FirstOrDefault();
            if (loggedUser == null)
            {
                return Unauthorized();
            }

            var claims = new[]
            {
                new Claim("LoggedUserId",loggedUser.Id.ToString()),
                new Claim("FirstName", loggedUser.FirstName.ToString()),
                new Claim("LastName", loggedUser.LastName.ToString())
            };

            string jwt = GenerateAccessToken(claims);
            
            Token token = new Token();

            token.OwnerId = loggedUser.Id;
            token.AccessToken = jwt;
            token.RefreshToken = Guid.NewGuid().ToString();
            token.ExpirationTime = DateTime.Now.AddMinutes(20);
            token.IsUsedRefreshToken = false;

            _dbContext.Tokens.Add(token);
            _dbContext.SaveChanges();

            return Ok(new { success = true, accessToken = jwt ,refreshToken = token.RefreshToken});

        }

        [HttpPost]
        [Route("RefreshToken")]
        public IActionResult RefreshToken([FromBody] RefreshTokenVM model)
        {
            
            Token item = _dbContext.Tokens.Where(u => u.RefreshToken == model.RefreshToken).FirstOrDefault();

            if (item == null)
            {
                return BadRequest(new { success = false, message = "Non existing Token" });
            }
            else if (item.IsUsedRefreshToken == true)
            {
                return BadRequest(new { success = false, message = "Used Token" });
            }
            else if (item.ExpirationTime <= DateTime.Now)
            {
                item.IsUsedRefreshToken = true;
                _dbContext.Tokens.Update(item);
                _dbContext.SaveChanges();

                return BadRequest(new { success = false ,message = "Expired Token"});
            }

            item.IsUsedRefreshToken = true;

            _dbContext.Tokens.Update(item);

            Token token = new Token();

            User loggedUser = _dbContext.Users.Where(u => u.Id == item.OwnerId).FirstOrDefault();

            var claims = new[]
            {
                new Claim("LoggedUserId",item.OwnerId.ToString()),
                new Claim("FirstName", loggedUser.FirstName.ToString()),
                new Claim("LastName", loggedUser.LastName.ToString())
            };

            string jwt = GenerateAccessToken(claims);

            token.OwnerId = item.OwnerId;
            token.AccessToken = jwt;
            token.RefreshToken = Guid.NewGuid().ToString();
            token.ExpirationTime = DateTime.Now.AddMinutes(5);
            token.IsUsedRefreshToken = false;

            _dbContext.Tokens.Add(token);
            _dbContext.SaveChanges();

            return Ok(new { success = true, accessToken = jwt, refreshToken = token.RefreshToken });

        }
        [HttpDelete]
        [Route("Logout")]
        public IActionResult Revoke([FromBody] RefreshTokenVM model)
        {
            
            if (string.IsNullOrEmpty(model.RefreshToken))
                return BadRequest(new { message = "Token is required" });

            Token item = _dbContext.Tokens.Where(u => u.RefreshToken == model.RefreshToken).FirstOrDefault();

            if (item == null)
                return NotFound(new { message = "Token not found" });

            item.IsUsedRefreshToken = true;

            _dbContext.Tokens.Update(item);
            _dbContext.SaveChanges();

            return Ok(new { message = "Token revoked" });
        }

        public string GenerateAccessToken(IEnumerable<Claim> claim)
        {
            string key = _configuration.GetValue<string>("JWT:secretKey").ToString();

            var secretKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(key));
            var signinCredentials = new SigningCredentials(secretKey, SecurityAlgorithms.HmacSha256);

            var tokenOptions = new JwtSecurityToken(
                issuer: _configuration.GetValue<string>("JWT:issuer").ToString(),
                audience: _configuration.GetValue<string>("JWT:audience").ToString(),
                claims: claim,
                expires: DateTime.Now.AddSeconds(30),
                signingCredentials: signinCredentials
            );

            var tokenString = new JwtSecurityTokenHandler().WriteToken(tokenOptions);

            return tokenString;

        }
    }
}

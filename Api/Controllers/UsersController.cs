using Common.Reposotories;
using Common.Entities;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using System.Collections.Generic;
using System.Linq;
using Api.ViewModels.Users;
using Common.Dto;
using AutoMapper;
using Common.Mapper;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.Authorization;

namespace Api.Controllers
{
    [Authorize(AuthenticationSchemes = JwtBearerDefaults.AuthenticationScheme)]
    [Route("api/[controller]")]
    [ApiController]
    public class UsersController : ControllerBase
    {
        private readonly UserManagementDbContext _dbContext;
        public UsersController(UserManagementDbContext dbContext)
        {
            _dbContext = dbContext;
        }

        [HttpGet]
        public IActionResult Get()
        {
            List<User> items = _dbContext.Users.ToList();

            return Ok(
                new
                {
                    success = true,
                    data = _dbContext.Users.ToList()
                });
        }

        [HttpPut]
        public IActionResult Put([FromBody]CreateVM model)
        {
            MapperConfiguration config = new MapperConfiguration(config => config
                                                              .AddProfile(new MapperProfile()));
            IMapper mapper = config.CreateMapper();

            UserManagementDbContext _dbContext = new UserManagementDbContext();
            User item = new User();

            item.Username = model.Username;
            item.Password = model.Password;
            item.FirstName = model.FirstName;
            item.LastName = model.LastName;

            _dbContext.Users.Add(item);
            _dbContext.SaveChanges();

            return Ok(new
            {
                success = true,
                data = mapper.Map<UserDto>(item)
            });
        }

        [HttpPost]
        public IActionResult Post([FromBody]EditVM model)
        {

            MapperConfiguration config = new MapperConfiguration(config => config
                                                              .AddProfile(new MapperProfile()));
            IMapper mapper = config.CreateMapper();

            User item = _dbContext.Users.Where(x => x.Id == model.Id).FirstOrDefault();

            if (item == null)
            {
                return NotFound();
            }

            item.Id = model.Id;
            item.Username = model.Username;
            item.Password = model.Password;
            item.FirstName = model.FirstName;
            item.LastName = model.LastName;

            _dbContext.Users.Update(item);
            _dbContext.SaveChanges();


            return Ok(new
            {
                success = true,
                data = mapper.Map<UserDto>(item)
            });
        }

        [HttpDelete]
        public IActionResult Delete(int Id)
        {

            MapperConfiguration config = new MapperConfiguration(config => config
                                                              .AddProfile(new MapperProfile()));
            IMapper mapper = config.CreateMapper();
            User item = _dbContext.Users.Where(x => x.Id == Id).FirstOrDefault();
            Project project = _dbContext.Project.Where(x => x.OwnerId == Id).FirstOrDefault();
            Task tasks = _dbContext.Tasks.Where(x => x.UserId == Id).FirstOrDefault();


            if (item == null)
            {
                return NotFound();
            }
            else if (project != null)
            {
                return Problem("The User has attached Projects");
            }else if (tasks != null)
            {
                return Problem("The User has attached Tasks");

            }

            _dbContext.Users.Remove(item);
            _dbContext.SaveChanges();

            return Ok(new {
                success = true,
                data = mapper.Map<UserDto>(item)
            });

        }
    }
}


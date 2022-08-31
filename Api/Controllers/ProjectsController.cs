using Api.ViewModels.Project;
using AutoMapper;
using Common.Dto;
using Common.Entities;
using Common.Mapper;
using Common.Reposotories;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using System.Collections.Generic;
using System.Linq;

namespace Api.Controllers
{
    [Authorize(AuthenticationSchemes = JwtBearerDefaults.AuthenticationScheme)]
    [Route("api/[controller]")]
    [ApiController]
    public class ProjectsController : ControllerBase
    {
        private readonly UserManagementDbContext _dbContext;
        public ProjectsController(UserManagementDbContext dbContext)
        {
            _dbContext = dbContext;
        }
        [HttpGet]
        public IActionResult Get()
        {
            MapperConfiguration config = new MapperConfiguration(config => config
                                                              .AddProfile(new MapperProfile()));
            IMapper mapper = config.CreateMapper();

            List<Project> items = _dbContext.Project.ToList();

            return Ok(new
            {
                success = true,
                data = mapper.Map<List<ProjectDto>>(items)
        });
        }

        [HttpPut]
        public IActionResult Put([FromBody] CreateVM model)
        {
            MapperConfiguration config = new MapperConfiguration(config => config
                                                              .AddProfile(new MapperProfile()));
            IMapper mapper = config.CreateMapper();

            Project item = new Project();

            item.Title = model.Title;
            item.Description = model.Description;
            item.OwnerId = model.OwnerId;

            _dbContext.Project.Add(item);
            _dbContext.SaveChanges();



            return Ok(new
            {
                success = true,
                data = mapper.Map<ProjectDto>(item)
            });
        }

        [HttpPost]
        public IActionResult Post([FromBody] EditVM model)
        {
            MapperConfiguration config = new MapperConfiguration(config => config
                                                              .AddProfile(new MapperProfile()));
            IMapper mapper = config.CreateMapper();

            Project item = _dbContext.Project.Where(x => x.Id == model.Id).FirstOrDefault();

            if (item == null)
            {
                return NotFound();
            }

            item.Title = model.Title;
            item.Description = model.Description;
            item.OwnerId = model.OwnerId;


            _dbContext.Project.Update(item);
            _dbContext.SaveChanges();

            return Ok(new
            {
                success = true,
                data = mapper.Map<ProjectDto>(item)
            });
        }

        [HttpDelete]
        public IActionResult Delete(int Id)
        {
            MapperConfiguration config = new MapperConfiguration(config => config
                                                              .AddProfile(new MapperProfile()));
            IMapper mapper = config.CreateMapper();

            Project item = _dbContext.Project.Where(x => x.Id == Id).FirstOrDefault();
            Task attachedTask = _dbContext.Tasks.Where(x => x.ProjectId == item.Id).FirstOrDefault();

            if (item == null)
            {
                return NotFound();
            }
            else if (attachedTask != null)
            {
                return Problem("The project has attached Tasks");
            }

            _dbContext.Project.Remove(item);
            _dbContext.SaveChanges();

            return Ok(new
            {
                success = true,
                data = mapper.Map<ProjectDto>(item)
            });
        }
    }
}

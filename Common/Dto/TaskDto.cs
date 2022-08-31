using System;
using System.Collections.Generic;
using System.Text;

namespace Common.Dto
{
    public class TaskDto
    {
        public int Id { get; set; }

        public int ProjectId { get; set; }
        public int UserId { get; set; }
        public string Title { get; set; }
        public string Description { get; set; }
        public int StoryPoints { get; set; }
        public DateTime CreatedTime { get; set; }
        public DateTime UpdatedTime { get; set; }
    }
}

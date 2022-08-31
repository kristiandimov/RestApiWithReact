using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Text;
using System.Text.Json.Serialization;

namespace Common.Entities
{
    public class Project
    {
        [Key]
        public int Id { get; set; }
        public int OwnerId { get; set; }
        public string Title { get; set; }
        public string Description { get; set; }

        [JsonIgnore]
        [ForeignKey(nameof(OwnerId))]
        public virtual User User { get; set; }
        [JsonIgnore]
        public virtual List<Task> Tasks { get; set; }
    }
}

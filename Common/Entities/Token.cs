using System;
using System.Collections.Generic;
using System.Text;

namespace Common.Entities
{
    public class Token
    {
        public int Id { get; set; }
        public int OwnerId { get; set; }
        public string AccessToken { get; set; }
        public string RefreshToken { get; set; }
        public bool IsUsedRefreshToken { get; set; }
        public DateTime ExpirationTime { get; set; }
        public virtual User User { get; set; }

    }
}

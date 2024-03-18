using Microsoft.AspNetCore.Mvc;
using myChores.Models;
using myChores.Interface;
using myChores.Services;
using System.Security.Claims;
using Microsoft.AspNetCore.Authorization;


namespace myChores.Controllers;

[ApiController]
[Route("[controller]")]
public class UserController : ControllerBase
{
    IUserService UserService;
    public UserController(IUserService UserService)
    {
        this.UserService = UserService;
    }

        [HttpPost]
        [Route("/login")]
        public ActionResult<String> Login([FromBody] User User)
        {
            var dt = DateTime.Now;

            if (User.Name == "Admin"
            && User.password == $"123")
            {
                var claims = new List<Claim>
                {
                    new Claim("type", "Admin"),
                    new Claim("id", "0"),
                };

                var token = TokenService.GetToken(claims);

                return new OkObjectResult(TokenService.WriteToken(token));
            }

            if (UserService.UserExists(User.Name,User.password) != -1){
                var userId = UserService.UserExists(User.Name,User.password);
            var claims = new List<Claim>
            {
                new Claim("type", "User"),
                new Claim("id",userId.ToString()),
            };
            var token = TokenService.GetToken(claims);
            return new OkObjectResult(TokenService.WriteToken(token));
        }
            
            return Unauthorized();
        }


    [HttpGet]
    [Authorize(Policy = "Admin")]
    public ActionResult<List<User>> Get()
    {
        return UserService.GetAll();
    }

    [HttpGet("{id}")]
    [Authorize(Policy = "User")]
    public ActionResult<User> GetUserById()
    {
        var userID = User.FindFirst("id").Value;
        var user = UserService.GetById(Convert.ToInt32(userID));
        if (user == null)
            return NotFound();
        return user;
    }

    [HttpPost]
    [Authorize(Policy = "Admin")]
    public IActionResult Create(User newUser)
    {
        UserService.Add(newUser);
        return CreatedAtAction(nameof(Create), new {id = newUser.Id}, newUser);
    }

    [HttpPut("{id}")]
    [Authorize(Policy = "User")]
    public IActionResult Update(int id, User newUser)
    {
        if(id != newUser.Id)
            return BadRequest();
        
        var existingUser = UserService.GetById(id);
        if (existingUser is null)
        {
            return NotFound();
        }
        UserService.Update(newUser);
        return NoContent();
    }

    [HttpDelete("{id}")]
    [Authorize(Policy = "Admin")]
    public IActionResult Delete(int id)
    {
        var user = UserService.GetById(id);
        if(user is null)
            return NotFound();
        
        UserService.Delete(id);

        return NoContent();
    }

}

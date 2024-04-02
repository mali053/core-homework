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
    public ActionResult<String> Login(string name, string password)
    {
        User user = UserService.UserExists(name, password); // Check if user exists and get user ID

        if (user != null)
        { 
            var claims = new List<Claim>
            {
                new Claim("id", user.Id.ToString()),
                new Claim("Type", user.status)
            };

            var token = TokenService.GetToken(claims);
            return new OkObjectResult(TokenService.WriteToken(token));
            }
        

        return Unauthorized(); // Invalid credentials or user does not exist
    }


    [HttpGet]
    [Route("/allUsers")]
    [Authorize(Policy = "Admin")]
    public ActionResult<List<User>> Get()
    {
        return UserService.GetAll();
    }

    [HttpGet]
    [Route("/myUser")]
    [Authorize(Policy = "User")]
    public ActionResult<User> GetUserById(int id)
    {
        var user = UserService.GetById(id);
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

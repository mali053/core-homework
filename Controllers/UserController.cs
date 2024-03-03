using Microsoft.AspNetCore.Mvc;
using myChores.Models;
using myChores.Interface;

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
    [HttpGet]
    public ActionResult<List<User>> Get()
    {
        return UserService.GetAll();
    }

    [HttpGet("{id}")]
    public ActionResult<User> Get(int id)
    {
        var user = UserService.GetById(id);
        if (user == null)
            return NotFound();
        return user;
    }

    [HttpPost]
    public IActionResult Create(User newUser)
    {
        UserService.Add(newUser);
        return CreatedAtAction(nameof(Create), new {id = newUser.Id}, newUser);
    }

    [HttpPut("{id}")]
    public IActionResult Update(int id,User newUser)
    {
        if(id != newUser.Id)
            return BadRequest();
        
        var existingChore = UserService.GetById(id);
        if (existingChore is null)
        {
            return NotFound();
        }
        UserService.Update(newUser);
        return NoContent();
    }

    [HttpDelete("{id}")]
    public IActionResult Delete(int id)
    {
        var user = UserService.GetById(id);
        if(user is null)
            return NotFound();
        
        UserService.Delete(id);

        return NoContent();
    }
}

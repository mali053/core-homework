using Microsoft.AspNetCore.Mvc;
using myChores.Models;
using myChores.Interface;
using Microsoft.AspNetCore.Authorization;

namespace myChores.Controllers;

[ApiController]
[Route("[controller]")]
public class ChoreController : ControllerBase
{
    IChoreService ChoreService;
    public ChoreController(IChoreService ChoreService)
    {
        this.ChoreService = ChoreService;
    }
    [HttpGet]
    [Authorize(Policy = "User")]
    public ActionResult<List<Chore>> Get()
    {
        var userID = User.FindFirst("id").Value;
        return ChoreService.GetAll(Convert.ToInt32(userID));
    }

    [HttpGet("{id}")]
    [Authorize(Policy = "User")]
    public ActionResult<Chore> Get(int id)
    {
        var userID = User.FindFirst("id").Value;
        var Chore = ChoreService.GetById(id, Convert.ToInt32(userID));
        if (Chore == null)
            return NotFound();
        return Chore;
    }

    [HttpPost]
    [Authorize(Policy = "User")]
    public IActionResult Create(Chore newChore)
    {
        // var newId = ChoreService.Add(newChore);

        // return CreatedAtAction("Post", 
        //     new {id = newId}, ChoreService.GetById(newId));
        var userID = User.FindFirst("id").Value;
        newChore.userId = Convert.ToInt32(userID);
        ChoreService.Add(newChore);
        return CreatedAtAction(nameof(Create), new {id = newChore.Id}, newChore);
    }

    [HttpPut("{id}")]
    [Authorize(Policy = "User")]
    public IActionResult Update(int id,Chore newChore)
    {
        if(id != newChore.Id)
            return BadRequest();
        var userID = User.FindFirst("id").Value;   
        var existingChore = ChoreService.GetById(id, Convert.ToInt32(userID));
        if (existingChore is null)
        {
            return NotFound();
        }
        newChore.userId=Convert.ToInt32(userID);
        ChoreService.Update(newChore.Id, newChore);
        return NoContent();
    }

    [HttpDelete("{id}")]
    [Authorize(Policy = "User")]
    public IActionResult Delete(int id)
    {
        var userID = User.FindFirst("id").Value;   
        var chore = ChoreService.GetById(id, Convert.ToInt32(userID));
        if(chore is null)
            return NotFound();
        
        ChoreService.Delete(id);

        return NoContent();
    }
}

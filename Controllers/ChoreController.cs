using Microsoft.AspNetCore.Mvc;
using myChores.Models;
using myChores.Interface;

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
    public ActionResult<List<Chore>> Get()
    {
        return ChoreService.GetAll();
    }

    [HttpGet("{id}")]
    public ActionResult<Chore> Get(int id)
    {
        var Chore = ChoreService.GetById(id);
        if (Chore == null)
            return NotFound();
        return Chore;
    }

    [HttpPost]
    public IActionResult Create(Chore newChore)
    {
        // var newId = ChoreService.Add(newChore);

        // return CreatedAtAction("Post", 
        //     new {id = newId}, ChoreService.GetById(newId));
        ChoreService.Add(newChore);
        return CreatedAtAction(nameof(Create), new {id = newChore.Id}, newChore);
    }

    [HttpPut("{id}")]
    public IActionResult Update(int id,Chore newChore)
    {
        if(id != newChore.Id)
            return BadRequest();
        
        var existingChore = ChoreService.GetById(id);
        if (existingChore is null)
        {
            return NotFound();
        }
        ChoreService.Update(newChore);
        return NoContent();
    }

    [HttpDelete("{id}")]
    public IActionResult Delete(int id)
    {
        var chore = ChoreService.GetById(id);
        if(chore is null)
            return NotFound();
        
        ChoreService.Delete(id);

        return NoContent();
    }
}

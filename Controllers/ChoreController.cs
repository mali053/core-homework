using Microsoft.AspNetCore.Mvc;
using myChores.Models;
using myChores.Interface;
using Microsoft.AspNetCore.Authorization;

namespace myChores.Controllers;

[ApiController]
[Route("[controller]")]
public class ChoreController : ControllerBase
{
    private IChoreService ChoreService;
    private readonly int UserID;
    public ChoreController(IChoreService choreService, IHttpContextAccessor httpContextAccessor)
    {
        ChoreService = choreService;
        UserID = int.Parse(httpContextAccessor.HttpContext?.User?.FindFirst("id")?.Value);
    }
    private int GetCurrentUserID() => UserID;

    [HttpGet]
    [Authorize(Policy = "User")]
    public ActionResult<List<Chore>> Get()
    {
        return ChoreService.GetAll(GetCurrentUserID());
    }

    [HttpGet("{id}")]
    [Authorize(Policy = "User")]
    public ActionResult<Chore> Get(int id)
    {
        var Chore = ChoreService.GetById(id, GetCurrentUserID());
        if (Chore == null)
            return NotFound();
        return Chore;
    }

    [HttpPost]
    [Authorize(Policy = "User")]
    public IActionResult Create(Chore newChore)
    {
        newChore.userId = GetCurrentUserID();
        ChoreService.Add(newChore);
        return CreatedAtAction(nameof(Create), new {id = newChore.Id}, newChore);
    }

    [HttpPut("{id}")]
    [Authorize(Policy = "User")]
    public IActionResult Update(int id,Chore newChore)
    {
        if(id != newChore.Id)
            return BadRequest();
        var existingChore = ChoreService.GetById(id, GetCurrentUserID());
        if (existingChore is null)
        {
            return NotFound();
        }
        newChore.userId=GetCurrentUserID();
        ChoreService.Update(newChore.Id, newChore);
        return NoContent();
    }

    [HttpDelete("{id}")]
    [Authorize(Policy = "User")]
    public IActionResult Delete(int id)
    {
        var chore = ChoreService.GetById(id, GetCurrentUserID());
        if(chore is null)
            return NotFound();
        
        ChoreService.Delete(id);

        return NoContent();
    }
}

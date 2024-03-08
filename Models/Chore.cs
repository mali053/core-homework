namespace myChores.Models;

public class Chore
{
    public int Id { get; set;}
    public string Name { get; set;}
    public bool IsDone {get; set;}
    public int userId { get; set;}
}
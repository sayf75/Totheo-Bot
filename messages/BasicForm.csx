using System;
using Microsoft.Bot.Builder.FormFlow;
using Microsoft.Bot.Builder.Datetime;

public enum CarOptions { Convertible = 1, SUV, EV };
public enum ColorOptions { Red = 1, White, Blue };

// For more information about this template visit http://aka.ms/azurebots-csharp-form
[Serializable]
public class BasicForm
{
    [Prompt("Où sera ton {&}?")]
    public string Souvenir { get; set; }

    [Prompt("Please select your favorite car type {||}")]
    public CarOptions Car { get; set; }

    [Prompt("Quand a été ton souvenir ? {||}")]
    public Datetime Date { get; set; }

    [Prompt("Please select your favorite {&} {||}")]
    public ColorOptions Color { get; set; }

    public static IForm<BasicForm> BuildForm()
    {
        // Builds an IForm<T> based on BasicForm
        return new FormBuilder<BasicForm>().Build();
    }

    public static IFormDialog<BasicForm> BuildFormDialog(FormOptions options = FormOptions.PromptInStart)
    {
        // Generated a new FormDialog<T> based on IForm<BasicForm>
        return FormDialog.FromForm(BuildForm, options);
    }
}

using System;
using Microsoft.Bot.Builder.FormFlow;

public enum CarOptions { Convertible = 1, SUV, EV };
public enum ColorOptions { Fred = 1, Jack, Queen, personne };
public DateTime date = DateTime.Now;
// For more information about this template visit http://aka.ms/azurebots-csharp-form
[Serializable]
public class BasicForm
{
    [Prompt("Où s'est passé votre {&}?")]
    public string Souvenir { get; set; }

    [Prompt("Sélectionner une date {now}")]
    public static DateTime now { get; }

    [Prompt("Quel est votre souvenir ?")]
    public string Chose { get; set; }

    [Prompt("Choisissez les personnes avec qui vous étiez {&} {||}")]
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

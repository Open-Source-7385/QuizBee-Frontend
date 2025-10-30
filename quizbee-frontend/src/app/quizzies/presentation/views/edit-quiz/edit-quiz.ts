// src/app/quizzies/presentation/views/edit-quiz/edit-quiz.component.ts
import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { Quiz } from '../../../domain/model/quiz.entity';
import { QuizApp } from '../../../application/quizz-app';
import { of, switchMap, take } from 'rxjs';

@Component({
  selector: 'app-edit-quiz',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule, TranslateModule],
  templateUrl: './edit-quiz.html',
  styleUrls: ['./edit-quiz.css']
})
export class EditQuizComponent implements OnInit {
  private fb = inject(FormBuilder);
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private quizService = inject(QuizApp);

  // UI state signals
  loading = signal<boolean>(true);
  saving = signal<boolean>(false);
  error = signal<string | null>(null);
  success = signal<string | null>(null);

  // form
  form = this.fb.group({
    title: ['', [Validators.required, Validators.maxLength(120)]],
    description: ['', [Validators.maxLength(500)]],
    category: ['', Validators.required],
    difficulty: [3, [Validators.min(1), Validators.max(6)]],
    points: [0, [Validators.min(0)]],
    // audioId or audioUrl can be added later
  });

  // current quiz
  quiz = signal<Quiz | null>(null);

  // categories: if you have a global list you can replace this
  categories: string[] = ['general', 'language', 'history', 'science'];

  ngOnInit(): void {
    this.loadQuiz();
  }

  private loadQuiz(): void {
    this.loading.set(true);
    this.error.set(null);

    const id = this.route.snapshot.paramMap.get('id');
    if (!id) {
      this.error.set('Quiz id missing');
      this.loading.set(false);
      return;
    }

    // quizService.getQuizById should return Observable<Quiz>
    // fall back gracefully if not implemented
    const obs = (this.quizService && typeof this.quizService.getQuizById === 'function')
      ? this.quizService.getQuizById(id)
      : of(null);

    // @ts-ignore

    obs.pipe(take(1)).subscribe({
      next: (q: any) => {
        if (!q) {
          this.error.set('Quiz no encontrado');
          this.loading.set(false);
          return;
        }
        this.quiz.set(q);
        // set form values
        this.form.patchValue({
          title: q.title ?? '',
          description: q.description ?? '',
          category: q.category ?? (this.categories[0] ?? ''),
          difficulty: q.difficulty ?? 3,
          points: q.points ?? 0
        });
        this.loading.set(false);
      },

    });
  }

  cancel(): void {
    // go back to my creations
    this.router.navigate(['/quizz/my-creations']);
  }

  async save(): Promise<void> {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }
    const current = this.quiz();
    if (!current) {
      this.error.set('Quiz no cargado');
      return;
    }
    this.saving.set(true);
    this.error.set(null);
    this.success.set(null);

    // Normalizar inputs del formulario para evitar `null`
    const title = (this.form.value.title ?? '').toString().trim();
    const descriptionVal = this.form.value.description;
    const description = descriptionVal === null ? undefined : (descriptionVal ?? undefined);

    const payload: Partial<Quiz> = {
      // evita propagar valores nulos del objeto original
      ...current,
      title,
      description,
      category: (this.form.value.category ?? current.category ?? '').toString(),
      difficultyLevel: Number(this.form.value.difficulty ?? current.difficultyLevel ?? 3),
      points: Number(this.form.value.points ?? current.points ?? 0)
    };


  }

  // helpers para template
  get title() { return this.form.get('title'); }
  get description() { return this.form.get('description'); }
  get category() { return this.form.get('category'); }
  get difficulty() { return this.form.get('difficulty'); }
  get points() { return this.form.get('points'); }

  // placeholder para manejar subida de audio (si en futuro quieres integrar)
  onAudioFileSelected(event: Event) {
    // const file = (event.target as HTMLInputElement).files?.[0];
    // TODO: subir el audio o convertir base64 y asociar al quiz (como hablamos antes)
    alert('Audio upload not implemented yet. It will be available later.');
  }
}

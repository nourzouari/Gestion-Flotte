import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AssignmentService } from '../../services/assignment.service';
import { Assignment } from '../../vehicle-assignment/assignment.model';
import { RouterModule } from '@angular/router';
import { MatTableModule } from '@angular/material/table';
import { MatCardModule } from '@angular/material/card';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { NavbarComponent } from '../../shared/navbar/navbar.component';
import { MatIconModule } from '@angular/material/icon';
import { Router } from '@angular/router';

@Component({
  selector: 'app-assignments-list',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    MatTableModule,
    MatCardModule,
    MatProgressSpinnerModule,
    NavbarComponent,
    MatIconModule,
  ],
  templateUrl: './assignments-list.component.html',
  styleUrls: ['./assignments-list.component.scss']
})
export class AssignmentsListComponent implements OnInit {
  assignments: Assignment[] = [];
  loading = false;
  errorMessage = '';

  displayedColumns: string[] = ['id', 'vehicle', 'driver', 'start_date', 'end_date', 'notes', 'actions'];

constructor(private router: Router, private assignmentService: AssignmentService) {}

  ngOnInit(): void {
    this.loadAssignments();
  }
editAssignment(id: number) {
  this.router.navigate(['/assign-vehicle', id]);
}
  loadAssignments(): void {
    this.loading = true;
    this.errorMessage = '';
    this.assignmentService.getAssignments().subscribe({
      next: (data) => {
        this.assignments = data;
        this.loading = false;
      },
      error: () => {
        this.errorMessage = 'Erreur lors du chargement des attributions.';
        this.loading = false;
      }
    });
  }

  deleteAssignment(id: number): void {
    if (confirm('Voulez-vous vraiment supprimer cette attribution ?')) {
      this.assignmentService.deleteAssignment(id).subscribe({
        next: () => this.loadAssignments(),
        error: () => this.errorMessage = 'Erreur lors de la suppression.'
      });
    }
  }
}

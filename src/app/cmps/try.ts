// File: src/main.ts
import { bootstrapApplication } from '@angular/platform-browser';
import { provideHttpClient } from '@angular/common/http';
import { AppComponent } from './app/app.component';
import { CommonModule } from '@angular/common';

bootstrapApplication(AppComponent, {
  providers: [],
  imports: [CommonModule]
}).catch(err => console.error(err));

// File: src/app/book.model.ts
export interface Book {
  id: number;
  title: string;
  author: string;
  price: number;
  rating: number;
}

// File: src/app/app.component.ts
import { Component } from '@angular/core';
import { Book } from './book.model';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  // Hardcoded book list
  books: Book[] = [
    { id: 1, title: 'The Hobbit', author: 'J.R.R. Tolkien', price: 10.99, rating: 4.8 },
    { id: 2, title: '1984', author: 'George Orwell', price: 8.99, rating: 4.6 },
    { id: 3, title: 'Clean Code', author: 'Robert C. Martin', price: 25.00, rating: 4.5 },
    { id: 4, title: 'You Don\'t Know JS', author: 'Kyle Simpson', price: 19.99, rating: 4.7 },
    { id: 5, title: 'Atomic Habits', author: 'James Clear', price: 16.50, rating: 4.3 }
  ];

  currentIndex: number = 0;
  wishlist: Book[] = [];
  sortBy: 'title' | 'price' | 'rating' = 'title';

  // Getters for template
  get currentBook(): Book {
    return this.books[this.currentIndex];
  }

  get hasPrev(): boolean {
    return this.currentIndex > 0;
  }

  get hasNext(): boolean {
    return this.currentIndex < this.books.length - 1;
  }

  get sortedWishlist(): Book[] {
    const list = [...this.wishlist];
    switch (this.sortBy) {
      case 'title':
        return list.sort((a, b) => a.title.localeCompare(b.title));
      case 'price':
        return list.sort((a, b) => a.price - b.price);
      case 'rating':
        return list.sort((a, b) => Math.round(b.rating) - Math.round(a.rating));
    }
    return list;
  }

  get totalPrice(): number {
    return this.wishlist.reduce((sum, book) => sum + book.price, 0);
  }

  // Navigation
  prev(): void {
    if (this.hasPrev) this.currentIndex--;
  }

  next(): void {
    if (this.hasNext) this.currentIndex++;
  }

  // Wishlist toggling
  toggleWishlist(book: Book, checked: boolean): void {
    if (checked) {
      this.wishlist = [...this.wishlist, book];
    } else {
      this.wishlist = this.wishlist.filter(b => b.id !== book.id);
    }
  }

  trackById(_index: number, book: Book): number {
    return book.id;
  }
}

// File: src/app/app.component.html
<div class="container">
  <div class="book-view">
    <button (click)="prev()" [disabled]="!hasPrev">←</button>
    <h2>{{ currentBook.title }}</h2>
    <p>Author: {{ currentBook.author }}</p>
    <p>Price: {{ currentBook.price | currency }}</p>
    <p>Rating:
      <span *ngFor="let _ of [].constructor(Math.round(currentBook.rating)); let i = index">★</span>
    </p>
    <label>
      <input
        type="checkbox"
        [checked]="wishlist.some(b => b.id === currentBook.id)"
        (change)="toggleWishlist(currentBook, $any($event.target).checked)"
      />
      Add to wishlist
    </label>
    <button (click)="next()" [disabled]="!hasNext">→</button>
  </div>

  <div class="wishlist">
    <h3>Wish List</h3>
    <div class="sort">
      Sort by:
      <select [value]="sortBy" (change)="sortBy = $any($event.target).value">
        <option value="title">Title</option>
        <option value="price">Price</option>
        <option value="rating">Rating</option>
      </select>
    </div>
    <ul>
      <li *ngFor="let book of sortedWishlist; trackBy: trackById">
        {{ book.title }} - {{ book.price | currency }}
        <button (click)="toggleWishlist(book, false)">X</button>
      </li>
    </ul>
    <p>Total: {{ totalPrice | currency }}</p>
  </div>
</div>

// File: src/app/app.component.css
.container {
  display: flex;
  gap: 2rem;
}
.book-view,
.wishlist {
  border: 1px solid #ccc;
  padding: 1rem;
}
.sort {
  margin-bottom: 1rem;
}
ul {
  list-style: none;
  padding: 0;
}
li {
  display: flex;
  justify-content: space-between;
  margin-bottom: 0.5rem;
}

import { Component, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Book } from '../../models/book.module';
import { BookService } from '../../services/book.service';



@Component({
  selector: 'books',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './books.component.html',
  styleUrl: './books.component.scss'
})
export class BooksComponent {
  books =  signal([
    {
      id: 1,
      title: "To Kill a Mockingbird",
      author: "Harper Lee",
      price: 12.99,
      rating: 4.8,
      imageUrl: "https://via.placeholder.com/120x180?text=To+Kill+a+Mockingbird"
    },
    {
      id: 2,
      title: "1984",
      author: "George Orwell",
      price: 10.99,
      rating: 4.6,
      imageUrl: "https://via.placeholder.com/120x180?text=1984"
    },
    {
      id: 3,
      title: "The Great Gatsby",
      author: "F. Scott Fitzgerald",
      price: 9.99,
      rating: 4.3,
      imageUrl: "https://via.placeholder.com/120x180?text=The+Great+Gatsby"
    },
    {
      id: 4,
      title: "Pride and Prejudice",
      author: "Jane Austen",
      price: 8.99,
      rating: 4.7,
      imageUrl: "https://via.placeholder.com/120x180?text=Pride+and+Prejudice"
    },
    {
      id: 5,
      title: "The Catcher in the Rye",
      author: "J.D. Salinger",
      price: 11.99,
      rating: 4.1,
      imageUrl: "https://via.placeholder.com/120x180?text=Catcher+in+the+Rye"
    },
    {
      id: 6,
      title: "The Hobbit",
      author: "J.R.R. Tolkien",
      price: 14.99,
      rating: 4.9,
      imageUrl: "https://via.placeholder.com/120x180?text=The+Hobbit"
    },
    {
      id: 7,
      title: "Brave New World",
      author: "Aldous Huxley",
      price: 12.49,
      rating: 4.5,
      imageUrl: "https://via.placeholder.com/120x180?text=Brave+New+World"
    },
    {
      id: 8,
      title: "The Alchemist",
      author: "Paulo Coelho",
      price: 9.49,
      rating: 4.4,
      imageUrl: "https://via.placeholder.com/120x180?text=The+Alchemist"
    }
  ]);

// גישה לדוגמה לספר הראשון:
// console.log(data.books[0].title); // "To Kill a Mockingbird"
  currentIndex = signal(0);
  wishlist = signal<Book[]>([]);
  sortBy = signal<'title'|'price'|'rating'>('title');

  constructor(private bookService: BookService) {}

  currentBook = computed(() => this.books()[this.currentIndex()]);
  roundedCurrentRating = computed(() => Math.round(this.currentBook().rating));
  hasPrev = computed(() => this.currentIndex() > 0);
  hasNext = computed(() => this.books().length > 0 && this.currentIndex() < this.books().length - 1);
  isInWishlist = computed(() => {
    const current = this.currentBook();
    return current ? this.wishlist().some(book => book.id === current.id) : false;
  });

  sortedWishlist = computed(() => {
    const list = [...this.wishlist()];
    switch (this.sortBy()) {
      case 'title': return list.sort((a, b) => a.title.localeCompare(b.title));
      case 'price': return list.sort((a, b) => a.price - b.price);
      case 'rating': return list.sort((a, b) => Math.round(b.rating) - Math.round(a.rating));
    }
    return list;
  });

  totalPrice = computed(() => this.wishlist().reduce((sum, book) => sum + book.price, 0));

  prev() { if (this.hasPrev()) this.currentIndex.update(i => i - 1); }
  next() { if (this.hasNext()) this.currentIndex.update(i => i + 1); }

  toggleWishlist(book: Book, checked: boolean) {
    if (checked) {
      this.wishlist.update(list => [...list, book]);
    } else {
      this.wishlist.update(list => list.filter(b => b.id !== book.id));
    }
  }

  trackById = (_: number, book: Book) => book.id;
}
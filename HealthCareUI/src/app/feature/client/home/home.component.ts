import { Component } from '@angular/core';
import { FooterComponent } from '../footer/footer.component';
import { HeaderComponent } from '../header/header.component';
import { RouterModule } from '@angular/router';
import { Router, RouterLink } from '@angular/router';
import { NzCarouselModule } from 'ng-zorro-antd/carousel';
import { CommonModule } from '@angular/common';
@Component({
  selector: 'app-home',
  imports: [
    HeaderComponent,
    FooterComponent,
    RouterModule,
    CommonModule,
    NzCarouselModule,
    RouterLink,
  ],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css',
})
export class HomeComponent {
  scrollToFooter() {
    const footer = document.getElementById('footer');
    if (footer) {
      footer.scrollIntoView({ behavior: 'smooth' });
    }
  }

  scrollToServicesSection() {
    const element = document.getElementById('services');
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  }

  scrollToBlogsSection() {
    const element = document.getElementById('blogs');
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  }

  scrollToAboutSection() {
    const element = document.getElementById('about');
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  }

  blogs = [
    {
      img: 'assets/blog1.jpg',
      alt: 'Blog 1',
      title: 'Top 7 Things You Should Know About STIs',
      desc: 'Key facts about sexually transmitted infections, symptoms, testing, and how to protect yourself.',
      link: '/blog/top-7-things-you-should-know-about-stis',
    },
    {
      img: 'assets/blog2.jpg',
      alt: 'Condoms and safe sex',
      title: 'How Safe Are Condoms?',
      desc: 'Discover the real effectiveness of condoms, what they protect against, and common misconceptions.',
      link: '/blog/how-safe-are-condoms',
    },
    {
      img: 'assets/blog3.jpg',
      alt: 'Parent talking with teenager about sex education',
      title: 'How to Talk About Sex With Your Teen',
      desc: 'Essential tips for parents on discussing sex, consent, and healthy relationships with teenagers.',
      link: '/blog/how-to-talk-about-sex-with-your-teen',
    },
    {
      img: 'assets/blog4.jpg',
      alt: 'Pregnant woman holding belly',
      title: 'Fetal Development: Stages of Growth',
      desc: 'Follow the amazing journey of fetal development from conception to birth, month by month.',
      link: '/blog/fetal-development-stages-of-growth',
    },
    {
      img: 'assets/blog5.png',
      alt: 'Medical researcher analyzing STI data',
      title: 'STIs: Key Facts from the WHO',
      desc: 'Important statistics and facts about sexually transmitted infections worldwide, from the WHO.',
      link: '/blog/sexually-transmitted-infections-stis',
    },
  ];

  currentIndex = 0;

  get visibleBlogs() {
    // Lấy 3 blog: trước, hiện tại, sau (nếu có)
    const total = this.blogs.length;
    const prev = (this.currentIndex - 1 + total) % total;
    const next = (this.currentIndex + 1) % total;
    return [this.blogs[prev], this.blogs[this.currentIndex], this.blogs[next]];
  }

  prevBlog() {
    this.currentIndex =
      (this.currentIndex - 1 + this.blogs.length) % this.blogs.length;
  }
  nextBlog() {
    this.currentIndex = (this.currentIndex + 1) % this.blogs.length;
  }

  searchTerm = '';
  filteredBlogs = this.blogs;
  highlightedIndexes: number[] = [];

  onHeaderSearch(term: string) {
    this.searchTerm = term;
    this.highlightedIndexes = [];
    const search = term.trim().toLowerCase();
    if (search) {
      this.blogs.forEach((blog, idx) => {
        if (
          blog.title.toLowerCase().includes(search) ||
          blog.desc.toLowerCase().includes(search)
        ) {
          this.highlightedIndexes.push(idx);
        }
      });
    }
  }

  applyBlogSearch() {
    const search = this.searchTerm.trim().toLowerCase();
    if (!search) {
      this.filteredBlogs = this.blogs;
    } else {
      this.filteredBlogs = this.blogs.filter(blog =>
        blog.title.toLowerCase().includes(search) ||
        blog.desc.toLowerCase().includes(search)
      );
    }
    // Reset carousel index nếu muốn
    this.currentIndex = 0;
  }
}

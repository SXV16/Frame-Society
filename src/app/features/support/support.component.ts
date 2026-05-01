import { Component, OnInit } from '@angular/core';

interface FAQ {
  question: string;
  steps: string[];
  expanded?: boolean;
}

@Component({
  selector: 'app-support',
  templateUrl: './support.component.html',
  styleUrls: ['./support.component.css']
})
export class SupportComponent implements OnInit {

  faqs: FAQ[] = [
    {
      question: 'How do I browse and sort the frame collections?',
      steps: [
        'Select "Store" from the primary top navigation bar.',
        'Use the "Sort by" dropdown menu on the right side of the gallery.',
        'Filter the collection by "Price: Low to High", "Price: High to Low", or "Newest" arrivals.',
        'Click on any frame to view its exclusive details.'
      ],
      expanded: false
    },
    {
      question: 'I am stuck on an unclickable background or a Golden popup.',
      steps: [
        'The Raphael Frame Society mandates that all guests verify our Terms & Conditions once.',
        'Look for the gold Modal window anchored on your screen.',
        'Read the user policy and scroll to the bottom of the window.',
        'Click the "Acknowledge & Proceed" action button to permanently unlock platform access.'
      ],
      expanded: false
    },
    {
      question: 'How do I modify the items in my secure cart?',
      steps: [
        'Click the shopping bag icon located in the top right corner.',
        'Hover over any item inside your cart overview.',
        'Use the plus (+) or minus (-) indicators to adjust the quantity.',
        'The cart subtotals will automatically compile your adjustments.'
      ],
      expanded: false
    },
    {
      question: 'How can I submit a new frame concept?',
      steps: [
        'Ensure you are logged into your registered member account.',
        'Click "Suggestion" in the top navigation array.',
        'Fill out the cinematic frame specification form.',
        'Our curation team will review the concept for our next drop cycle.'
      ],
      expanded: false
    }
  ];

  constructor() { }

  ngOnInit(): void {
  }

  toggleFaq(index: number): void {
    this.faqs[index].expanded = !this.faqs[index].expanded;
  }
}

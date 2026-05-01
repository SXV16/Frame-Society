const fs = require('fs');
let ts = fs.readFileSync('src/app/features/product/product.component.ts', 'utf8');

ts = ts.replace(
  '  submittingReview = false;',
  '  submittingReview = false;\n  hoverRating = 0;\n  bottomHoverRating = 0;\n  topRatingInteracted = false;'
);

fs.writeFileSync('src/app/features/product/product.component.ts', ts);

import Quill from 'quill';

// Configure Quill formats once globally
let formatsConfigured = false;

export const configureQuillFormats = () => {
  if (formatsConfigured) return;
  
  try {
    // Register size format
    const Size = Quill.import('attributors/style/size');
    if (Size) {
      Size.whitelist = ['10px', '12px', '14px', '16px', '18px', '20px', '24px', '32px'];
      Quill.register(Size, true);
    }
    
    // Register font format
    const Font = Quill.import('attributors/style/font');
    if (Font) {
      Font.whitelist = ['arial', 'helvetica', 'times', 'courier', 'verdana', 'georgia'];
      Quill.register(Font, true);
    }
    
    formatsConfigured = true;
  } catch (error) {
    console.warn('Could not configure Quill formats:', error);
  }
};

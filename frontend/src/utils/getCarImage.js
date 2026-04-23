export const getCarImage = (car) => {
  if (car.image_url) return car.image_url;

  // Fallback high-quality car images based on brand
  const brandImages = {
    'Tesla': 'https://images.unsplash.com/photo-1560958089-b8a1929cea89?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
    'Ford': 'https://images.unsplash.com/photo-1551830820-330a71b99659?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
    'Honda': 'https://images.unsplash.com/photo-1590362891991-f776e747a588?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
    'BMW': 'https://images.unsplash.com/photo-1555353540-64fd3b1ec27e?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
    'Audi': 'https://images.unsplash.com/photo-1603584173870-7f23fdae1b7a?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
    'Mercedes': 'https://images.unsplash.com/photo-1618843479313-40f8afb4b4d8?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80'
  };

  if (car.brand && brandImages[car.brand]) {
    return brandImages[car.brand];
  }

  // Fallback high-quality car images based on category
  const categoryImages = {
    'SUV': 'https://images.unsplash.com/photo-1519689680058-324335c77eba?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
    'Sedan': 'https://images.unsplash.com/photo-1552519507-da3b142c6e3d?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
    'Hatchback': 'https://images.unsplash.com/photo-1588636186358-166299bbfc62?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
    'Truck': 'https://images.unsplash.com/photo-1559404098-b76fd8dcbe08?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80'
  };

  if (car.category && categoryImages[car.category]) {
    return categoryImages[car.category];
  }

  // Default beautiful luxury car image
  return 'https://images.unsplash.com/photo-1494976388531-d1058494cdd8?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80';
};

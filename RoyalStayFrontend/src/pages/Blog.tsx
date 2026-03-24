
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { Calendar, User, Clock, ArrowRight } from 'lucide-react';

const blogPosts = [
  {
    id: 1,
    title: 'Top 10 Luxury Destinations in India for 2024',
    excerpt: 'Discover the most sought-after luxury destinations that offer unparalleled experiences, from royal palaces to pristine beaches.',
    content: 'From the royal heritage of Rajasthan to the serene backwaters of Kerala...',
    image: 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80',
    author: 'Travel Team',
    date: '2024-07-15',
    readTime: '8 min read',
    category: 'Travel Guide'
  },
  {
    id: 2,
    title: 'The Art of Luxury Hospitality: What Makes a Stay Memorable',
    excerpt: 'Explore the elements that transform a simple stay into an unforgettable luxury experience.',
    content: 'Luxury hospitality goes beyond premium amenities...',
    image: 'https://images.unsplash.com/photo-1571896349842-33c89424de2d?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2080&q=80',
    author: 'Hospitality Expert',
    date: '2024-07-10',
    readTime: '6 min read',
    category: 'Hospitality'
  },
  {
    id: 3,
    title: 'Sustainable Luxury: Eco-Friendly Travel Trends',
    excerpt: 'How modern luxury accommodations are embracing sustainability without compromising on comfort.',
    content: 'The future of luxury travel is green...',
    image: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80',
    author: 'Sustainability Team',
    date: '2024-07-05',
    readTime: '7 min read',
    category: 'Sustainability'
  },
  {
    id: 4,
    title: 'Culinary Journeys: Michelin-Star Dining Experiences',
    excerpt: 'A guide to the finest dining experiences available at luxury resorts across India.',
    content: 'Culinary excellence is at the heart of luxury hospitality...',
    image: 'https://images.unsplash.com/photo-1560472354-b33ff0c44a43?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2126&q=80',
    author: 'Culinary Expert',
    date: '2024-06-30',
    readTime: '5 min read',
    category: 'Dining'
  },
  {
    id: 5,
    title: 'Wellness Retreats: Rejuvenate Your Mind and Body',
    excerpt: 'Discover luxury wellness retreats that offer transformative spa and wellness experiences.',
    content: 'In today\'s fast-paced world, wellness retreats have become...',
    image: 'https://images.unsplash.com/photo-1571003123894-1f0594d2b5d9?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2080&q=80',
    author: 'Wellness Expert',
    date: '2024-06-25',
    readTime: '9 min read',
    category: 'Wellness'
  },
  {
    id: 6,
    title: 'Heritage Hotels: Where History Meets Luxury',
    excerpt: 'Experience the grandeur of India\'s royal past with these magnificent heritage properties.',
    content: 'Heritage hotels offer a unique blend of historical significance...',
    image: 'https://images.unsplash.com/photo-1602002418082-a4443e081dd1?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2126&q=80',
    author: 'Heritage Team',
    date: '2024-06-20',
    readTime: '6 min read',
    category: 'Heritage'
  }
];

const categories = ['All', 'Travel Guide', 'Hospitality', 'Sustainability', 'Dining', 'Wellness', 'Heritage'];

const Blog = () => {
  return (
    <div className="min-h-screen bg-luxury-950">
      <Navbar />
      
      {/* Header Section */}
      <section className="pt-24 pb-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto text-center">
          <h1 className="text-4xl sm:text-6xl font-bold mb-6">
            Travel <span className="gradient-text">Blog</span>
          </h1>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto">
            Insights, tips, and stories from the world of luxury travel and hospitality
          </p>
        </div>
      </section>

      {/* Category Filter */}
      <section className="pb-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-wrap justify-center gap-4">
            {categories.map((category) => (
              <button
                key={category}
                className="px-6 py-3 rounded-full text-sm font-medium bg-luxury-800 text-gray-300 hover:bg-luxury-700 hover:text-white border border-luxury-700 transition-all duration-300"
              >
                {category}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Post */}
      <section className="pb-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="luxury-card rounded-2xl overflow-hidden">
            <div className="grid grid-cols-1 lg:grid-cols-2">
              <div className="relative">
                <img 
                  src={blogPosts[0].image}
                  alt={blogPosts[0].title}
                  className="w-full h-64 lg:h-full object-cover"
                />
                <div className="absolute top-4 left-4">
                  <span className="bg-royal-gradient px-3 py-1 rounded-full text-white text-xs font-medium">
                    Featured
                  </span>
                </div>
              </div>
              
              <div className="p-8 lg:p-12">
                <div className="flex items-center gap-4 text-sm text-gray-400 mb-4">
                  <span className="bg-royal-900/30 text-royal-300 px-3 py-1 rounded-full">
                    {blogPosts[0].category}
                  </span>
                  <div className="flex items-center">
                    <Calendar className="w-4 h-4 mr-1" />
                    {new Date(blogPosts[0].date).toLocaleDateString()}
                  </div>
                  <div className="flex items-center">
                    <Clock className="w-4 h-4 mr-1" />
                    {blogPosts[0].readTime}
                  </div>
                </div>
                
                <h2 className="text-2xl lg:text-3xl font-bold text-white mb-4">
                  {blogPosts[0].title}
                </h2>
                
                <p className="text-gray-300 text-lg leading-relaxed mb-6">
                  {blogPosts[0].excerpt}
                </p>
                
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <User className="w-4 h-4 text-gray-400 mr-2" />
                    <span className="text-gray-400 text-sm">{blogPosts[0].author}</span>
                  </div>
                  
                  <Button className="bg-royal-gradient hover:shadow-lg hover:shadow-royal-500/25 transition-all duration-300">
                    Read More
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Blog Posts Grid */}
      <section className="pb-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-3xl font-bold text-white mb-12 text-center">Latest Articles</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {blogPosts.slice(1).map((post, index) => (
              <article 
                key={post.id}
                className="luxury-card rounded-xl overflow-hidden hover-lift group animate-scale-in"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <div className="relative overflow-hidden">
                  <img 
                    src={post.image}
                    alt={post.title}
                    className="w-full h-48 object-cover group-hover:scale-110 transition-transform duration-500"
                  />
                  <div className="absolute top-4 left-4">
                    <span className="bg-luxury-900/80 backdrop-blur-sm text-royal-400 px-3 py-1 rounded-full text-xs font-medium">
                      {post.category}
                    </span>
                  </div>
                </div>

                <div className="p-6">
                  <div className="flex items-center gap-4 text-xs text-gray-400 mb-3">
                    <div className="flex items-center">
                      <Calendar className="w-3 h-3 mr-1" />
                      {new Date(post.date).toLocaleDateString()}
                    </div>
                    <div className="flex items-center">
                      <Clock className="w-3 h-3 mr-1" />
                      {post.readTime}
                    </div>
                  </div>

                  <h3 className="text-lg font-semibold text-white mb-3 line-clamp-2 group-hover:text-royal-400 transition-colors duration-200">
                    {post.title}
                  </h3>

                  <p className="text-gray-400 text-sm leading-relaxed mb-4 line-clamp-3">
                    {post.excerpt}
                  </p>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <User className="w-3 h-3 text-gray-500 mr-1" />
                      <span className="text-gray-500 text-xs">{post.author}</span>
                    </div>
                    
                    <Button 
                      variant="ghost" 
                      size="sm"
                      className="text-royal-400 hover:text-royal-300 p-0 h-auto font-medium"
                    >
                      Read More
                      <ArrowRight className="w-3 h-3 ml-1" />
                    </Button>
                  </div>
                </div>
              </article>
            ))}
          </div>

          {/* Load More Button */}
          <div className="text-center mt-12">
            <Button 
              variant="outline"
              size="lg"
              className="border-royal-400 text-royal-400 hover:bg-royal-400 hover:text-luxury-950 px-8 py-4 h-auto font-semibold"
            >
              Load More Articles
            </Button>
          </div>
        </div>
      </section>

      {/* Newsletter CTA */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-luxury-900/50">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">
            Stay Updated with <span className="gradient-text">Travel Insights</span>
          </h2>
          <p className="text-xl text-gray-300 mb-8">
            Subscribe to our blog and never miss the latest travel trends, luxury destinations, and insider tips
          </p>
          <div className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
            <input
              type="email"
              placeholder="Enter your email"
              className="flex-1 px-4 py-3 bg-luxury-800 border border-luxury-700 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-royal-400"
            />
            <Button className="bg-royal-gradient px-8">
              Subscribe
            </Button>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Blog;

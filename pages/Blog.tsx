import { useEffect, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'motion/react';
import { Clock } from 'lucide-react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { formatPostDate, loadBlogPosts } from '../lib/loadBlogPosts';

export default function Blog() {
  const posts = useMemo(() => loadBlogPosts(), []);

  useEffect(() => {
    document.title = 'Blog — Shreshti';
  }, []);

  return (
    <div className="min-h-screen w-full bg-[#050108]">
      <Navbar />

      <section className="relative pt-24 pb-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center mb-12"
          >
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-white mb-4">Blog</h1>
            <p className="text-saffron-100 max-w-2xl mx-auto text-lg">
              Notes on AI, data platforms and financial services
            </p>
            <div className="w-20 h-1 bg-gradient-to-r from-saffron-500 to-bjp-green mx-auto mt-4" />
          </motion.div>

          {posts.length === 0 ? (
            <p className="text-center text-gray-300">No posts yet.</p>
          ) : (
            <ul className="space-y-6">
              {posts.map((post, index) => (
                <motion.li
                  key={post.slug}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: index * 0.05 }}
                  viewport={{ once: true, margin: '-60px' }}
                >
                  <Link
                    to={`/blog/${post.slug}`}
                    className="block bg-black/40 backdrop-blur-md rounded-xl p-6 border border-transparent hover:border-saffron-500/40 transition-colors"
                  >
                    <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-sm text-saffron-300 mb-2">
                      <time dateTime={post.date}>{formatPostDate(post.date)}</time>
                      <span className="inline-flex items-center gap-1 text-gray-400">
                        <Clock size={14} aria-hidden="true" />
                        {post.readingMinutes} min read
                      </span>
                    </div>
                    <h2 className="text-xl sm:text-2xl font-bold text-white mb-2">{post.title}</h2>
                    <p className="text-gray-300">{post.description}</p>
                    {post.tags.length > 0 && (
                      <ul className="flex flex-wrap gap-2 mt-4">
                        {post.tags.map((tag) => (
                          <li
                            key={tag}
                            className="text-xs text-saffron-100 bg-saffron-500/10 border border-saffron-500/30 rounded-full px-3 py-1"
                          >
                            {tag}
                          </li>
                        ))}
                      </ul>
                    )}
                  </Link>
                </motion.li>
              ))}
            </ul>
          )}
        </div>
      </section>

      <Footer />
    </div>
  );
}

import { useEffect, useMemo } from 'react';
import { Link, Navigate, useParams } from 'react-router-dom';
import ReactMarkdown, { type Components } from 'react-markdown';
import { ArrowLeft, Clock } from 'lucide-react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { formatPostDate, loadBlogPosts } from '../lib/loadBlogPosts';

const markdownComponents: Components = {
  h2: ({ children }) => (
    <h2 className="text-2xl sm:text-3xl font-bold text-white mt-12 mb-4 pb-2 border-b border-saffron-500/30">
      {children}
    </h2>
  ),
  h3: ({ children }) => (
    <h3 className="text-xl font-bold text-saffron-300 mt-8 mb-3">{children}</h3>
  ),
  p: ({ children }) => <p className="text-gray-200 leading-relaxed mb-4">{children}</p>,
  a: ({ href, children }) => (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className="text-saffron-300 underline underline-offset-2 decoration-saffron-500/50 hover:text-white break-words"
    >
      {children}
    </a>
  ),
  strong: ({ children }) => <strong className="font-semibold text-white">{children}</strong>,
  em: ({ children }) => <em className="text-gray-300">{children}</em>,
  ul: ({ children }) => (
    <ul className="list-disc pl-6 mb-4 space-y-2 text-gray-200 marker:text-saffron-400">{children}</ul>
  ),
  ol: ({ children }) => (
    <ol className="list-decimal pl-6 mb-4 space-y-2 text-gray-200 marker:text-saffron-400">{children}</ol>
  ),
  li: ({ children }) => <li className="leading-relaxed">{children}</li>,
  hr: () => <hr className="my-10 border-saffron-500/20" />,
  code: ({ children }) => (
    <code className="bg-white/10 rounded px-1.5 py-0.5 text-sm text-saffron-100">{children}</code>
  ),
};

export default function BlogPost() {
  const { slug } = useParams<{ slug: string }>();
  const post = useMemo(() => loadBlogPosts().find((p) => p.slug === slug), [slug]);

  useEffect(() => {
    if (post) document.title = `${post.title} — Shreshti`;
  }, [post]);

  if (!post) return <Navigate to="/blog" replace />;

  return (
    <div className="min-h-screen w-full bg-[#050108]">
      <Navbar />

      <article className="pt-24 pb-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl mx-auto">
          <Link
            to="/blog"
            className="inline-flex items-center gap-2 text-sm text-saffron-300 hover:text-white mb-8"
          >
            <ArrowLeft size={16} aria-hidden="true" />
            All posts
          </Link>

          <header className="mb-10">
            <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-sm text-saffron-300 mb-3">
              <time dateTime={post.date}>{formatPostDate(post.date)}</time>
              <span className="inline-flex items-center gap-1 text-gray-400">
                <Clock size={14} aria-hidden="true" />
                {post.readingMinutes} min read
              </span>
            </div>
            <h1 className="text-3xl sm:text-4xl font-bold text-white mb-4">{post.title}</h1>
            <div className="w-20 h-1 bg-gradient-to-r from-saffron-500 to-bjp-green" />
          </header>

          <div className="bg-black/30 rounded-xl p-5 sm:p-8">
            <ReactMarkdown components={markdownComponents}>{post.body}</ReactMarkdown>
          </div>
        </div>
      </article>

      <Footer />
    </div>
  );
}

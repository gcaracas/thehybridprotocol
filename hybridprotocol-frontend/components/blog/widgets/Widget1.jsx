"use client";
import { archiveLinks } from "@/data/archeve";
import { widgetPosts } from "@/data/blogs";
import Image from "next/image";
import React, { useState, useEffect } from "react";
import CommentsWidget from "./CommentsWidget";
import apiService from "@/utlis/api";

export default function Widget1({
  searchInputClass = "form-control input-md search-field input-circle",
  contentType,
  contentId,
  contentData, // Pass the actual newsletter/podcast data
}) {
  // Extract categories and tags from the content data
  const categories = contentData?.category ? [contentData.category] : [];
  const tags = contentData?.tags || [];

  // State for dynamic posts
  const [dynamicPosts, setDynamicPosts] = useState([]);
  const [loadingPosts, setLoadingPosts] = useState(false);

  // Helper function to get the display name (English by default)
  const getDisplayName = (item) => {
    if (item.name_english) {
      return item.name_english;
    }
    if (item.name) {
      return item.name;
    }
    return 'Unknown';
  };

  // Helper function to truncate text to 2 lines
  const truncateText = (text, maxLength = 80) => {
    if (!text) return '';
    if (text.length <= maxLength) return text;
    return text.substring(0, maxLength) + '...';
  };

  // Fetch dynamic posts based on contentType
  useEffect(() => {
    const fetchDynamicPosts = async () => {
      if (!contentType) return;
      
      try {
        setLoadingPosts(true);
        let response;
        
        if (contentType === 'newsletter') {
          response = await apiService.getNewsletters(1, 5); // Get 5 most recent newsletters
        } else if (contentType === 'podcast') {
          response = await apiService.getPodcastEpisodes(1, 5); // Get 5 most recent podcasts
        } else {
          return; // Use default widgetPosts for other content types
        }
        
        const posts = response.results || response;
        setDynamicPosts(posts);
      } catch (error) {
        console.error('Error fetching dynamic posts:', error);
        setDynamicPosts([]);
      } finally {
        setLoadingPosts(false);
      }
    };

    fetchDynamicPosts();
  }, [contentType]);

  return (
    <>
      <div className="widget">
        <form onSubmit={(e) => e.preventDefault()} className="form">
          <div className="search-wrap">
            <button
              className="search-button animate"
              type="submit"
              title="Start Search"
            >
              <i className="mi-search size-18" />
              <span className="visually-hidden">Start search</span>
            </button>
            <input
              type="text"
              className={searchInputClass}
              placeholder="Search..."
              required
            />
          </div>
        </form>
      </div>
      {/* End Search Widget */}
      
      {/* Categories Widget - Only show if content has categories */}
      {categories.length > 0 && (
        <div className="widget">
          <h3 className="widget-title">Categories</h3>
          <div className="widget-body">
            <ul className="clearlist widget-menu">
              {categories.map((category) => (
                <li key={category.id}>
                  <span className="text-muted">
                    {getDisplayName(category)}
                  </span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      )}
      {/* End Categories Widget */}
      
      {/* Tags Widget - Only show if content has tags */}
      {tags.length > 0 && (
        <div className="widget">
          <h3 className="widget-title">Tags</h3>
          <div className="widget-body">
            <div className="tags">
              {tags.map((tag) => (
                <span key={tag.id} className="tag-display">
                  {getDisplayName(tag)}
                </span>
              ))}
            </div>
          </div>
        </div>
      )}
      {/* End Tags Widget */}
      
      {/* Comments Widget */}
      {contentType && contentId && (
        <CommentsWidget contentType={contentType} contentId={contentId} />
      )}
      {/* End Comments Widget */}
      
      {/* Widget */}
      <div className="widget">
        <h3 className="widget-title">Latest posts</h3>
        <div className="widget-body">
          <ul className="clearlist widget-posts">
            {loadingPosts ? (
              <li className="clearfix">
                <div className="widget-posts-descr">
                  <span>Loading...</span>
                </div>
              </li>
            ) : contentType === 'newsletter' || contentType === 'podcast' ? (
              // Dynamic posts for newsletter/podcast pages
              dynamicPosts.map((post, index) => (
                <li key={post.id || index} className="clearfix">
                  <a href={`/${contentType === 'podcast' ? 'podcasts' : contentType}-single/${post.slug}`}>
                    <Image
                      src={contentType === 'newsletter' ? post.featured_image_url : post.cover_image_url}
                      height={140}
                      style={{ height: "fit-content" }}
                      alt=""
                      width={100}
                      className="widget-posts-img"
                    />
                  </a>
                  <div className="widget-posts-descr">
                    <a href={`/${contentType === 'podcast' ? 'podcasts' : contentType}-single/${post.slug}`} title="">
                      {contentType === 'newsletter' ? 'Excerpt:' : ''} {truncateText(contentType === 'newsletter' ? post.excerpt : post.description)}
                    </a>
                    <span>Posted on {new Date(contentType === 'newsletter' ? post.published_at : post.publish_date).toLocaleDateString()}</span>
                  </div>
                </li>
              ))
            ) : (
              // Default widget posts for other content types
              widgetPosts.map((post, index) => (
                <li key={index} className="clearfix">
                  <a href="#">
                    <Image
                      src={post.imgUrl}
                      height={140}
                      style={{ height: "fit-content" }}
                      alt=""
                      width={100}
                      className="widget-posts-img"
                    />
                  </a>
                  <div className="widget-posts-descr">
                    <a href="#" title="">
                      {post.title}
                    </a>
                    <span>Posted by {post.author}</span>
                  </div>
                </li>
              ))
            )}
          </ul>
        </div>
      </div>
      {/* End Widget */}
      
      {/* Widget */}
      <div className="widget">
        <h3 className="widget-title">Text widget</h3>
        <div className="widget-body">
          <div className="widget-text clearfix">
            <Image
              src="/assets/images/blog/previews/post-prev-6.jpg"
              height={140}
              alt="Image Description"
              style={{ height: "fit-content" }}
              width={100}
              className="left img-left"
            />
            Consectetur adipiscing elit. Quisque magna ante eleifend eleifend.
            Purus ut dignissim consectetur, nulla erat ultrices purus, ut
            consequat sem elit non sem. Quisque magna ante eleifend eleifend.
          </div>
        </div>
      </div>
      {/* End Widget */}
      
      {/* Widget */}
      <div className="widget">
        <h3 className="widget-title">Archive</h3>
        <div className="widget-body">
          <ul className="clearlist widget-menu">
            {archiveLinks.map((link) => (
              <li key={link.id}>
                <a href="#" title="">
                  {link.date}
                </a>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </>
  );
}

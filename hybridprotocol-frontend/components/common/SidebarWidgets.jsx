'use client';

import { useState, useEffect } from 'react';
import Image from "next/image";
import apiService from '@/utlis/api';

export default function SidebarWidgets({ contentType = 'podcast', onFilterChange }) {
  const [categories, setCategories] = useState([]);
  const [tags, setTags] = useState([]);
  const [archives, setArchives] = useState([]);
  const [textWidgets, setTextWidgets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [selectedTags, setSelectedTags] = useState([]);
  const [selectedArchive, setSelectedArchive] = useState(null);
  const [selectedLanguage, setSelectedLanguage] = useState(null);

  // Language options
  const languageOptions = [
    { id: 'all', name: 'All Languages', value: null },
    { id: 'english', name: 'English', value: 'english' },
    { id: 'spanish', name: 'Spanish', value: 'spanish' },
    { id: 'both', name: 'English & Spanish', value: 'both' }
  ];

  useEffect(() => {
    fetchWidgetData();
  }, []);

  const fetchWidgetData = async () => {
    try {
      setLoading(true);
      const [categoriesData, tagsData, archivesData] = await Promise.all([
        apiService.getCategories(),
        apiService.getTags(),
        apiService.getArchives()
      ]);
      
      // Handle paginated responses
      setCategories(categoriesData.results || categoriesData);
      setTags(tagsData.results || tagsData);
      setArchives(archivesData.results || archivesData);
    } catch (error) {
      console.error('Error fetching widget data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCategoryClick = (category) => {
    const newCategory = selectedCategory?.id === category.id ? null : category;
    setSelectedCategory(newCategory);
    setSelectedTags([]);
    setSelectedArchive(null);
    setSelectedLanguage(null);
    
    if (onFilterChange) {
      onFilterChange({
        category: newCategory,
        tags: [],
        archive: null,
        language: null
      });
    }
  };

  const handleTagClick = (tag) => {
    const newTags = selectedTags.find(t => t.id === tag.id)
      ? selectedTags.filter(t => t.id !== tag.id)
      : [...selectedTags, tag];
    
    setSelectedTags(newTags);
    setSelectedCategory(null);
    setSelectedArchive(null);
    setSelectedLanguage(null);
    
    if (onFilterChange) {
      onFilterChange({
        category: null,
        tags: newTags,
        archive: null,
        language: null
      });
    }
  };

  const handleArchiveClick = (archive) => {
    const newArchive = selectedArchive?.id === archive.id ? null : archive;
    setSelectedArchive(newArchive);
    setSelectedCategory(null);
    setSelectedTags([]);
    setSelectedLanguage(null);
    
    if (onFilterChange) {
      onFilterChange({
        category: null,
        tags: [],
        archive: newArchive,
        language: null
      });
    }
  };

  const handleLanguageClick = (language) => {
    const newLanguage = selectedLanguage?.id === language.id ? null : language;
    setSelectedLanguage(newLanguage);
    setSelectedCategory(null);
    setSelectedTags([]);
    setSelectedArchive(null);
    
    if (onFilterChange) {
      onFilterChange({
        category: null,
        tags: [],
        archive: null,
        language: newLanguage?.value || null
      });
    }
  };

  const isCategorySelected = (category) => selectedCategory?.id === category.id;
  const isTagSelected = (tag) => selectedTags.some(t => t.id === tag.id);
  const isArchiveSelected = (archive) => selectedArchive?.id === archive.id;
  const isLanguageSelected = (language) => selectedLanguage?.id === language.id;

  if (loading) {
    return (
      <div className="row mt-n60">
        <div className="col-sm-6 col-lg-3 mt-60">
          <div className="widget mb-0">
            <h3 className="widget-title">Loading...</h3>
          </div>
        </div>
      </div>
    );
  }

  return (
    <section className="page-section">
      <div className="container relative">
        <div className="row mt-n60">
          <div className="col-sm-6 col-lg-3 mt-60">
            {/* Categories Widget */}
            <div className="widget mb-0">
              <h3 className="widget-title">Categories</h3>
              <div className="widget-body">
                <ul className="clearlist widget-menu">
                  {categories.map((category) => (
                    <li key={category.id}>
                      <a 
                        href="#" 
                        title=""
                        onClick={(e) => {
                          e.preventDefault();
                          handleCategoryClick(category);
                        }}
                        className={isCategorySelected(category) ? 'active' : ''}
                        style={{
                          color: isCategorySelected(category) ? '#007bff' : 'inherit',
                          fontWeight: isCategorySelected(category) ? 'bold' : 'normal'
                        }}
                      >
                        {category.name_english}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>

          <div className="col-sm-6 col-lg-3 mt-60">
            {/* Tags Widget */}
            <div className="widget mb-0">
              <h3 className="widget-title">Tags</h3>
              <div className="widget-body">
                <div className="tags">
                  {tags.map((tag) => (
                    <a 
                      href="#" 
                      key={tag.id}
                      onClick={(e) => {
                        e.preventDefault();
                        handleTagClick(tag);
                      }}
                      className={isTagSelected(tag) ? 'active' : ''}
                      style={{
                        backgroundColor: isTagSelected(tag) ? '#007bff' : 'transparent',
                        color: isTagSelected(tag) ? 'white' : 'inherit',
                        border: isTagSelected(tag) ? '1px solid #007bff' : '1px solid #ddd'
                      }}
                    >
                      {tag.name_english}
                    </a>
                  ))}
                </div>
              </div>
            </div>
          </div>

          <div className="col-sm-6 col-lg-3 mt-60">
            {/* Archive Widget */}
            <div className="widget mb-0">
              <h3 className="widget-title">Archive</h3>
              <div className="widget-body">
                <ul className="clearlist widget-menu">
                  {archives.map((archive) => (
                    <li key={archive.id}>
                      <a 
                        href="#" 
                        title=""
                        onClick={(e) => {
                          e.preventDefault();
                          handleArchiveClick(archive);
                        }}
                        className={isArchiveSelected(archive) ? 'active' : ''}
                        style={{
                          color: isArchiveSelected(archive) ? '#007bff' : 'inherit',
                          fontWeight: isArchiveSelected(archive) ? 'bold' : 'normal'
                        }}
                      >
                        {archive.month_name} {archive.year}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>

          <div className="col-sm-6 col-lg-3 mt-60">
            {/* Language Widget */}
            <div className="widget mb-0">
              <h3 className="widget-title">Language</h3>
              <div className="widget-body">
                <ul className="clearlist widget-menu">
                  {languageOptions.map((language) => (
                    <li key={language.id}>
                      <a 
                        href="#" 
                        title=""
                        onClick={(e) => {
                          e.preventDefault();
                          handleLanguageClick(language);
                        }}
                        className={isLanguageSelected(language) ? 'active' : ''}
                        style={{
                          color: isLanguageSelected(language) ? '#007bff' : 'inherit',
                          fontWeight: isLanguageSelected(language) ? 'bold' : 'normal'
                        }}
                      >
                        {language.name}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>

          <div className="col-sm-6 col-lg-3 mt-60">
            {/* Text Widget */}
            <div className="widget mb-0">
              <h3 className="widget-title">Text widget</h3>
              <div className="widget-body">
                <div className="widget-text clearfix">
                  <Image
                    src="/assets/images/blog/previews/post-prev-6.jpg"
                    alt="Image Description"
                    height={140}
                    width={100}
                    style={{
                      width: 'auto',
                      height: 'auto'
                    }}
                    className="left img-left"
                  />
                  Consectetur adipiscing elit. Quisque magna ante
                  eleifend eleifend. Purus ut dignissim consectetur,
                  nulla erat ultrices purus, ut consequat sem elit non
                  sem. Quisque magna ante eleifend eleifend.
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
} 
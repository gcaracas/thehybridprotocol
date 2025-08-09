'use client';

import { useState, useEffect } from 'react';
import Image from "next/image";
import apiService from '@/utlis/api';

export default function SidebarWidgets({ contentType = 'podcast', onFilterChange, isSidebar = false }) {
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
    { id: 'spanish', name: 'Spanish', value: 'spanish' }
  ];

  useEffect(() => {
    fetchWidgetData();
  }, []);

  const fetchWidgetData = async () => {
    try {
      setLoading(true);
      const [categoriesData, tagsData, archivesData, textWidgetsData] = await Promise.all([
        apiService.getCategories(),
        apiService.getTags(),
        apiService.getArchives(),
        apiService.getTextWidgets()
      ]);
      
      // Handle paginated responses
      setCategories(categoriesData.results || categoriesData);
      setTags(tagsData.results || tagsData);
      setArchives(archivesData.results || archivesData);
      setTextWidgets(textWidgetsData.results || textWidgetsData);
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
    <section className={isSidebar ? "" : "page-section"}>
      <div className={isSidebar ? "" : "container relative"}>
        <div className={isSidebar ? "" : "row mt-n60"}>
          <div className={isSidebar ? "" : "col-sm-6 col-lg-3 mt-60"}>
            {/* Categories Widget */}
            <div className="widget mb-0">
              <h3 className="widget-title">Categories</h3>
              <div className="widget-body">
                <ul className="clearlist widget-menu">
                  {categories.map((category) => (
                    <li key={category.id} style={{ marginBottom: '8px' }}>
                      <a 
                        href="#" 
                        title=""
                        onClick={(e) => {
                          e.preventDefault();
                          handleCategoryClick(category);
                        }}
                        className={isCategorySelected(category) ? 'active' : ''}
                        style={{
                          display: 'inline-block',
                          padding: '6px 12px',
                          borderRadius: '4px',
                          textDecoration: 'none',
                          fontSize: '14px',
                          transition: 'all 0.2s ease',
                          backgroundColor: 'white',
                          color: isCategorySelected(category) ? '#2c3e50' : '#666',
                          border: isCategorySelected(category) ? '2px solid #2c3e50' : '1px solid #ddd',
                          fontWeight: isCategorySelected(category) ? '600' : 'normal',
                          cursor: 'pointer'
                        }}
                        onMouseEnter={(e) => {
                          if (!isCategorySelected(category)) {
                            e.target.style.color = '#2c3e50';
                            e.target.style.fontWeight = '600';
                          }
                        }}
                        onMouseLeave={(e) => {
                          if (!isCategorySelected(category)) {
                            e.target.style.color = '#666';
                            e.target.style.fontWeight = 'normal';
                          }
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

          <div className={isSidebar ? "" : "col-sm-6 col-lg-3 mt-60"}>
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
                        display: 'inline-block',
                        padding: '6px 12px',
                        borderRadius: '4px',
                        textDecoration: 'none',
                        fontSize: '14px',
                        transition: 'all 0.2s ease',
                        backgroundColor: 'white',
                        color: isTagSelected(tag) ? '#2c3e50' : '#666',
                        border: isTagSelected(tag) ? '2px solid #2c3e50' : '1px solid #ddd',
                        fontWeight: isTagSelected(tag) ? '600' : 'normal',
                        cursor: 'pointer'
                      }}
                      onMouseEnter={(e) => {
                        if (!isTagSelected(tag)) {
                          e.target.style.color = '#2c3e50';
                          e.target.style.fontWeight = '600';
                        }
                      }}
                      onMouseLeave={(e) => {
                        if (!isTagSelected(tag)) {
                          e.target.style.color = '#666';
                          e.target.style.fontWeight = 'normal';
                        }
                      }}
                    >
                      {tag.name_english}
                    </a>
                  ))}
                </div>
              </div>
            </div>
          </div>

          <div className={isSidebar ? "" : "col-sm-6 col-lg-3 mt-60"}>
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
                          display: 'inline-block',
                          padding: '6px 12px',
                          borderRadius: '4px',
                          textDecoration: 'none',
                          fontSize: '14px',
                          transition: 'all 0.2s ease',
                          backgroundColor: 'white',
                          color: isArchiveSelected(archive) ? '#2c3e50' : '#666',
                          border: isArchiveSelected(archive) ? '2px solid #2c3e50' : '1px solid #ddd',
                          fontWeight: isArchiveSelected(archive) ? '600' : 'normal',
                          cursor: 'pointer'
                        }}
                        onMouseEnter={(e) => {
                          if (!isArchiveSelected(archive)) {
                            e.target.style.color = '#2c3e50';
                            e.target.style.fontWeight = '600';
                          }
                        }}
                        onMouseLeave={(e) => {
                          if (!isArchiveSelected(archive)) {
                            e.target.style.color = '#666';
                            e.target.style.fontWeight = 'normal';
                          }
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

          <div className={isSidebar ? "" : "col-sm-6 col-lg-3 mt-60"}>
            {/* Language Widget */}
            <div className="widget mb-0">
              <h3 className="widget-title">Language</h3>
              <div className="widget-body">
                <ul className="clearlist widget-menu">
                  {languageOptions.map((language) => (
                    <li key={language.id} style={{ marginBottom: '8px' }}>
                      <a 
                        href="#" 
                        title=""
                        onClick={(e) => {
                          e.preventDefault();
                          handleLanguageClick(language);
                        }}
                        className={isLanguageSelected(language) ? 'active' : ''}
                        style={{
                          display: 'inline-block',
                          padding: '6px 12px',
                          borderRadius: '4px',
                          textDecoration: 'none',
                          fontSize: '14px',
                          transition: 'all 0.2s ease',
                          backgroundColor: 'white',
                          color: isLanguageSelected(language) ? '#2c3e50' : '#666',
                          border: isLanguageSelected(language) ? '2px solid #2c3e50' : '1px solid #ddd',
                          fontWeight: isLanguageSelected(language) ? '600' : 'normal',
                          cursor: 'pointer'
                        }}
                        onMouseEnter={(e) => {
                          if (!isLanguageSelected(language)) {
                            e.target.style.color = '#2c3e50';
                            e.target.style.fontWeight = '600';
                          }
                        }}
                        onMouseLeave={(e) => {
                          if (!isLanguageSelected(language)) {
                            e.target.style.color = '#666';
                            e.target.style.fontWeight = 'normal';
                          }
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

          {textWidgets.length > 0 && textWidgets.map((widget) => (
            <div key={widget.id} className={isSidebar ? "" : "col-sm-6 col-lg-3 mt-60"}>
              {/* Text Widget */}
              <div className="widget mb-0">
                <h3 className="widget-title">{widget.title_english}</h3>
                <div className="widget-body">
                  <div className={`widget-text ${isSidebar ? "" : "clearfix"}`}>
                    {widget.image_url && (
                      <Image
                        src={widget.image_url}
                        alt={widget.title_english}
                        height={isSidebar ? 200 : 140}
                        width={isSidebar ? 150 : 100}
                        style={{
                          width: isSidebar ? '100%' : 'auto',
                          height: 'auto',
                          marginBottom: isSidebar ? '15px' : '0',
                          borderRadius: '4px'
                        }}
                        className={isSidebar ? "" : "left img-left"}
                      />
                    )}
                    <div className="widget-content" style={{ 
                      marginTop: isSidebar ? '0' : '10px', 
                      lineHeight: '1.6',
                      fontSize: isSidebar ? '14px' : 'inherit'
                    }}>
                      {widget.content_english}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
} 
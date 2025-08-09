'use client';

import { getLanguageDisplayText } from "@/utlis/languageUtils";

export default function ContentMetadata({ contentData, contentType }) {
  // Extract categories and tags from the content data
  const categories = contentData?.category ? [contentData.category] : [];
  const tags = contentData?.tags || [];

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

  // Get language display text (limited to Spanish/English)
  const languageText = getLanguageDisplayText(contentData);

  return (
    <div className="content-metadata mb-40 mb-xs-30">
      {/* Categories Section */}
      {categories.length > 0 && (
        <div className="metadata-section mb-20">
          <h4 className="metadata-title mb-10">
            <i className="mi-folder size-16 me-2" />
            Categories
          </h4>
          <div className="metadata-items">
            {categories.map((category) => (
              <span key={category.id} className="metadata-item">
                {getDisplayName(category)}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Tags Section */}
      {tags.length > 0 && (
        <div className="metadata-section mb-20">
          <h4 className="metadata-title mb-10">
            <i className="mi-tag size-16 me-2" />
            Tags
          </h4>
          <div className="metadata-items">
            {tags.map((tag) => (
              <span key={tag.id} className="metadata-item">
                {getDisplayName(tag)}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Language Section */}
      <div className="metadata-section">
        <h4 className="metadata-title mb-10">
          <i className="mi-flag size-16 me-2" />
          Language
        </h4>
        <div className="metadata-items">
          <span className="metadata-item">
            {languageText}
          </span>
        </div>
      </div>

      <style jsx>{`
        .content-metadata {
          background: #f8f9fa;
          padding: 20px;
          border-radius: 8px;
          border-left: 4px solid #2c3e50;
        }

        .metadata-section:last-child {
          margin-bottom: 0;
        }

        .metadata-title {
          font-size: 16px;
          font-weight: 600;
          color: #2c3e50;
          margin: 0;
          display: flex;
          align-items: center;
        }

        .metadata-items {
          display: flex;
          flex-wrap: wrap;
          gap: 8px;
        }

        .metadata-item {
          display: inline-block;
          padding: 6px 12px;
          background: white;
          color: #666;
          border: 1px solid #ddd;
          border-radius: 4px;
          font-size: 14px;
          font-weight: normal;
          cursor: default;
          user-select: none;
        }

        .metadata-item:hover {
          background: #f8f9fa;
        }
      `}</style>
    </div>
  );
} 
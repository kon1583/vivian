module Jekyll
  class CategoryIndex < Page
    def initialize(site, base, dir, category)
      @site = site
      @base = base
      @dir = dir
      @name = 'index.html'
      self.process(@name)
      self.read_yaml(File.join(base, '_layouts'), 'category_archive.html')
      self.data['category'] = category
      category_title_prefix = site.config['category_title_prefix'] || ''
      category_title_suffix = site.config['category_title_suffix'] || '&rdquo;'
      self.data['title'] = "#{category_title_prefix}#{category}#{category_title_suffix}"
    end
  end
  class CategoryGenerator < Generator
    safe true
    def generate(site)
      if site.layouts.key? 'category_archive'
        dir = site.config['cateogry_dir'] || ''
        site.categories.keys.each do |category|
          write_category_index(site, File.join(dir, category), category)
        end
      end
    end
    def write_category_index(site, dir, category)
      index = CategoryIndex.new(site, site.source, dir, category)
      index.render(site.layouts, site.site_payload)
      index.write(site.dest)
      site.pages << index
    end
  end
end

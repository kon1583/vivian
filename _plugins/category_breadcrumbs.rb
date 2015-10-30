module Jekyll
  class CategotryBreadcrumbs <  Generator
    def generate(site)
      site.posts.each do |post|
        cats = post.categories

        html = "<ol class='breadcrumbs'>"
        cats.each_with_index do |parts_i, i|
          html += "<li>"
          text = parts_i
          id = cats.slice(0, i + 1).join('-').downcase
          href = "#{id}"
          html +=  (i < cats.length - 1) ?  "<a href='#{href}'>#{text}</a>" : post.title
          html += "</li>"
        end
        html += "</ol>"

        post.data["breadcrumbs"] = html
      end
    end
  end
end

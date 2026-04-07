export function useModelShowcase() {
  const [slides, setSlides] = useState<ModelShowcaseSlide[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadSlides = async () => {
      try {
        // Load the manifest file that lists all slides
        const manifestResponse = await fetch('/content/model-showcase-manifest.md');
        let slideSlugs: string[] = [];
        
        if (manifestResponse.ok) {
          const manifestContent = await manifestResponse.text();
          const { frontmatter } = parseFrontmatter(manifestContent);
          slideSlugs = frontmatter.slides || [];
        }

        // If no manifest, try to load a default list
        if (slideSlugs.length === 0) {
          slideSlugs = ['slide-1', 'slide-2', 'slide-3'];
        }

        const loadedSlides: ModelShowcaseSlide[] = [];
        
        for (const slug of slideSlugs) {
          try {
            const response = await fetch(`/content/model-showcase/${slug}.md`);
            if (!response.ok) continue;
            
            const content = await response.text();
            const { frontmatter } = parseFrontmatter(content);
            
            // Only add if it has images
            if (frontmatter.beforeImage || frontmatter.afterImage || frontmatter.image) {
              loadedSlides.push({
                slug,
                title: frontmatter.title || '',
                description: frontmatter.description || '',
                beforeImage: frontmatter.beforeImage || frontmatter.image || '',
                afterImage: frontmatter.afterImage || frontmatter.image || '',
                order: frontmatter.order || 999,
              });
            }
          } catch {
            // Skip files that don't exist or fail to load
          }
        }

        setSlides(loadedSlides.sort((a, b) => a.order - b.order));
      } catch (error) {
        console.error('Error loading model showcase:', error);
      } finally {
        setLoading(false);
      }
    };

    loadSlides();
  }, []);

  return { slides, loading };
}

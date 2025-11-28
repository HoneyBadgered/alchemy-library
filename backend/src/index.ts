// Seed data for categories
const categorySeeds = [
  { name: "Tea Education", slug: "tea-education", type: "blog" },
  { name: "Herbal Ingredients", slug: "herbal-ingredients", type: "blog" },
  { name: "Brewing & Preparation", slug: "brewing-preparation", type: "blog" },
  { name: "Tea Culture & Traditions", slug: "tea-culture-traditions", type: "blog" },
  { name: "Recipes & Pairings", slug: "recipes-pairings", type: "blog" },
  { name: "Wellness & Relaxation", slug: "wellness-relaxation", type: "blog" },
  { name: "Behind the Blend", slug: "behind-the-blend", type: "blog" },
  { name: "Business & Craft", slug: "business-craft", type: "blog" },
  { name: "Product Spotlights", slug: "product-spotlights", type: "blog" },
  { name: "Seasonal Features", slug: "seasonal-features", type: "blog" },
  { name: "Botanical Profiles", slug: "botanical-profiles", type: "grimoire" },
  { name: "Sensory Practices", slug: "sensory-practices", type: "grimoire" },
  { name: "Tea Rituals & Routines", slug: "tea-rituals-routines", type: "grimoire" },
  { name: "Blendcraft & Techniques", slug: "blendcraft-techniques", type: "grimoire" },
  { name: "Foundations of Flavor", slug: "foundations-of-flavor", type: "grimoire" },
  { name: "Ingredient Energies", slug: "ingredient-energies", type: "grimoire" },
  { name: "Tea Traditions", slug: "tea-traditions", type: "grimoire" },
  { name: "Seasonal Notes", slug: "seasonal-notes", type: "grimoire" },
  { name: "Crafting Tools & Methods", slug: "crafting-tools-methods", type: "grimoire" },
  { name: "Mindful Brewing", slug: "mindful-brewing", type: "grimoire" },
];

// Seed data for tags
const tagSeeds = [
  { name: "green tea", slug: "green-tea" },
  { name: "black tea", slug: "black-tea" },
  { name: "white tea", slug: "white-tea" },
  { name: "oolong tea", slug: "oolong-tea" },
  { name: "pu-erh", slug: "pu-erh" },
  { name: "matcha", slug: "matcha" },
  { name: "rooibos", slug: "rooibos" },
  { name: "honeybush", slug: "honeybush" },
  { name: "yerba mate", slug: "yerba-mate" },
  { name: "chamomile", slug: "chamomile" },
  { name: "rose petals", slug: "rose-petals" },
  { name: "lavender", slug: "lavender" },
  { name: "hibiscus", slug: "hibiscus" },
  { name: "jasmine", slug: "jasmine" },
  { name: "calendula", slug: "calendula" },
  { name: "elderflower", slug: "elderflower" },
  { name: "chrysanthemum", slug: "chrysanthemum" },
  { name: "blue cornflower", slug: "blue-cornflower" },
  { name: "butterfly pea flower", slug: "butterfly-pea-flower" },
  { name: "apple", slug: "apple" },
  { name: "lemon peel", slug: "lemon-peel" },
  { name: "orange peel", slug: "orange-peel" },
  { name: "bergamot", slug: "bergamot" },
  { name: "peach", slug: "peach" },
  { name: "apricot", slug: "apricot" },
  { name: "raspberry", slug: "raspberry" },
  { name: "strawberry", slug: "strawberry" },
  { name: "blueberry", slug: "blueberry" },
  { name: "cranberry", slug: "cranberry" },
  { name: "mango", slug: "mango" },
  { name: "pineapple", slug: "pineapple" },
  { name: "ginger", slug: "ginger" },
  { name: "turmeric", slug: "turmeric" },
  { name: "cinnamon", slug: "cinnamon" },
  { name: "cardamom", slug: "cardamom" },
  { name: "clove", slug: "clove" },
  { name: "star anise", slug: "star-anise" },
  { name: "fennel", slug: "fennel" },
  { name: "licorice root", slug: "licorice-root" },
  { name: "chicory root", slug: "chicory-root" },
  { name: "dandelion root", slug: "dandelion-root" },
  { name: "peppermint", slug: "peppermint" },
  { name: "spearmint", slug: "spearmint" },
  { name: "lemongrass", slug: "lemongrass" },
  { name: "lemon balm", slug: "lemon-balm" },
  { name: "sage", slug: "sage" },
  { name: "thyme", slug: "thyme" },
  { name: "rosemary", slug: "rosemary" },
  { name: "nettle", slug: "nettle" },
  { name: "echinacea", slug: "echinacea" },
  { name: "tulsi", slug: "tulsi" },
  { name: "honey crystals", slug: "honey-crystals" },
  { name: "vanilla", slug: "vanilla" },
  { name: "cacao nibs", slug: "cacao-nibs" },
  { name: "cocoa shells", slug: "cocoa-shells" },
  { name: "maple sugar", slug: "maple-sugar" },
  { name: "brown sugar", slug: "brown-sugar" },
  { name: "caramel pieces", slug: "caramel-pieces" },
  { name: "stevia leaf", slug: "stevia-leaf" },
  { name: "almond", slug: "almond" },
  { name: "coconut", slug: "coconut" },
  { name: "sesame", slug: "sesame" },
  { name: "chia seed", slug: "chia-seed" },
  { name: "hemp seed", slug: "hemp-seed" },
  { name: "brewing tips", slug: "brewing-tips" },
  { name: "steeping guide", slug: "steeping-guide" },
  { name: "water temperature", slug: "water-temperature" },
  { name: "iced tea", slug: "iced-tea" },
  { name: "hot tea", slug: "hot-tea" },
  { name: "cold brew", slug: "cold-brew" },
  { name: "tea ratios", slug: "tea-ratios" },
  { name: "calming teas", slug: "calming-teas" },
  { name: "digestive support", slug: "digestive-support" },
  { name: "relaxation", slug: "relaxation" },
  { name: "morning blends", slug: "morning-blends" },
  { name: "evening blends", slug: "evening-blends" },
  { name: "comfort blends", slug: "comfort-blends" },
  { name: "focus blends", slug: "focus-blends" },
  { name: "soothing ingredients", slug: "soothing-ingredients" },
  { name: "blendmaking", slug: "blendmaking" },
  { name: "flavor pairing", slug: "flavor-pairing" },
  { name: "ingredient spotlight", slug: "ingredient-spotlight" },
  { name: "sensory notes", slug: "sensory-notes" },
  { name: "aroma notes", slug: "aroma-notes" },
  { name: "tasting notes", slug: "tasting-notes" },
  { name: "mindful brewing", slug: "mindful-brewing" },
  { name: "herbal knowledge", slug: "herbal-knowledge" },
  { name: "ingredient profiles", slug: "ingredient-profiles" },
  { name: "winter blends", slug: "winter-blends" },
  { name: "spring blends", slug: "spring-blends" },
  { name: "summer blends", slug: "summer-blends" },
  { name: "autumn blends", slug: "autumn-blends" },
  { name: "seasonal ingredients", slug: "seasonal-ingredients" },
  { name: "sourcing", slug: "sourcing" },
  { name: "sustainability", slug: "sustainability" },
  { name: "packaging", slug: "packaging" },
  { name: "behind the brand", slug: "behind-the-brand" },
  { name: "product development", slug: "product-development" },
];

export default {
  /**
   * An asynchronous register function that runs before
   * your application is initialized.
   *
   * This gives you an opportunity to extend code.
   */
  register(/* { strapi } */) {},

  /**
   * An asynchronous bootstrap function that runs before
   * your application gets started.
   *
   * This gives you an opportunity to set up your data model,
   * run jobs, or perform some special logic.
   */
  async bootstrap({ strapi }) {
    strapi.log.info('Alchemy Library Backend starting up...');

    // Seed categories
    const existingCategories = await strapi.documents('api::category.category').findMany();
    if (existingCategories.length === 0) {
      strapi.log.info('Seeding categories...');
      for (const category of categorySeeds) {
        await strapi.documents('api::category.category').create({
          data: category,
        });
      }
      strapi.log.info(`Seeded ${categorySeeds.length} categories`);
    } else {
      strapi.log.info(`Categories already seeded (${existingCategories.length} found)`);
    }

    // Seed tags
    const existingTags = await strapi.documents('api::tag.tag').findMany();
    if (existingTags.length === 0) {
      strapi.log.info('Seeding tags...');
      for (const tag of tagSeeds) {
        await strapi.documents('api::tag.tag').create({
          data: tag,
        });
      }
      strapi.log.info(`Seeded ${tagSeeds.length} tags`);
    } else {
      strapi.log.info(`Tags already seeded (${existingTags.length} found)`);
    }
  },
};

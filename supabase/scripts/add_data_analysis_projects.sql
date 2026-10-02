-- Paste this entire file into Supabase Dashboard > SQL Editor > New query.
-- Adds three owner-supplied Data Analysis projects as drafts.
-- It does not overwrite existing projects, settings, media, or publications.
-- Safe to rerun: matching kind/slug records are left unchanged.
-- Add real dashboard screenshots in Admin > Media and Projects, then publish.

begin;

select pg_advisory_xact_lock(8675309);

do $add_data_projects$
declare
  item jsonb;
  entry_id uuid;
  revision_id uuid;
  records jsonb := $records$
  [
    {
      "source": "Owner-supplied Data Analysis portfolio case study; original case study supplied by the owner",
      "payload": {
        "title": "Nigerian FMCG Sales Analysis",
        "slug": "nigerian-fmcg-sales-analysis",
        "summary": "Analyzed 20,000 simulated Nigerian FMCG sales transactions across six geopolitical zones to uncover revenue trends, regional performance, product profitability, sales channel effectiveness, and delivery efficiency.",
        "scope": "data",
        "featured": true,
        "order": 1,
        "cover": "",
        "alt": "",
        "category": "Independent Project · ApexFoods Nigeria Plc (simulated business)",
        "body": "## Project Overview\n\nThis project explores sales performance for a simulated Nigerian fast-moving consumer goods (FMCG) distributor, ApexFoods Nigeria Plc. The dataset contains 20,000 transactions covering January to December 2025 across Nigeria's six geopolitical zones. The goal was to consolidate fragmented sales data into a clear reporting view that helps business stakeholders understand revenue drivers, product performance, regional differences, sales representative productivity, and delivery efficiency.\n\n## Project Scope\n\n- Clean and validate transaction data using Excel and Power Query.\n- Explore trends and patterns using Pivot Tables.\n- Compare revenue across regions, products, and sales channels.\n- Examine sales target achievement and delivery performance.\n- Present findings through an interactive Power BI dashboard.\n\n## Dataset\n\nThe dataset was generated using a Python script to simulate realistic Nigerian FMCG operations. It contains 20,000 records and 28 columns. It is a simulated dataset, not verified transaction data from a real company.\n\n## Deliverable\n\nAn interactive Power BI dashboard supported by documented findings and recommendations for sales planning, distribution, inventory, and operational improvement.",
        "blocks": [
          {
            "heading": "Overview & problem",
            "body": "ApexFoods Nigeria Plc is a simulated FMCG distributor operating across Nigeria's six geopolitical zones. Its sales data was assumed to be fragmented across regional offices, making it difficult to evaluate performance consistently.\n\nThe analysis addresses five core questions:\n\n- Which regions generate the most revenue?\n- Which products contribute most to sales?\n- How effective are different sales channels?\n- Are sales representatives achieving their targets?\n- Where are delivery delays most common?",
            "image": "",
            "alt": ""
          },
          {
            "heading": "My role & contributions",
            "body": "I carried out the data analysis workflow, from understanding the business questions to preparing the dataset and presenting findings.\n\nMy contributions included:\n\n- Profiling the dataset and identifying missing values.\n- Cleaning and standardizing fields with Excel and Power Query.\n- Checking transaction identifiers for duplicates and validating date fields.\n- Exploring sales patterns using Pivot Tables.\n- Building an interactive Power BI dashboard.\n- Translating the findings into business recommendations.",
            "image": "",
            "alt": ""
          },
          {
            "heading": "Approach & outcomes",
            "body": "The workflow followed three stages: data preparation, exploratory analysis, and dashboard development.\n\nKey findings from the analysis:\n\n- South West generated 32% of total revenue, followed by South South at 22%.\n- Cooking Oil and Instant Noodles contributed 52% of revenue combined.\n- Distributor sales represented 45% of transactions.\n- Approximately 42% of sales representatives consistently achieved monthly targets.\n- Delivery delays were concentrated in some northern regions.\n\nThese results highlighted differences in regional performance, product contribution, channel mix, and distribution efficiency.",
            "image": "",
            "alt": ""
          },
          {
            "heading": "Recommendations",
            "body": "Based on the analysis, the following actions could help improve performance:\n\n- Investigate logistics bottlenecks in the North East and North West.\n- Evaluate opportunities to expand the online sales channel.\n- Review product promotions around seasonal demand peaks.\n- Use sales performance data to guide coaching and target-setting.\n- Review pricing and product bundles for lower-value sales channels.\n\nThese recommendations are derived from the simulated dataset and should be validated against actual company data before implementation.",
            "image": "",
            "alt": ""
          }
        ],
        "tools": ["Excel", "Power Query", "Pivot Tables", "Power BI", "DAX", "Data Cleaning", "Data Visualization"],
        "links": [
          {
            "label": "Original Case Study",
            "url": "https://personal-portfolio-da.vercel.app/projects/fmcg-sales-analysis"
          }
        ],
        "externalUrl": "",
        "platform": "",
        "embedUrl": "",
        "embedTitle": "",
        "date": "January-December 2025",
        "seoTitle": "Nigerian FMCG Sales Analysis | Hassana Abdullahi",
        "seoDescription": "A Power BI analysis of 20,000 simulated Nigerian FMCG transactions across regions, products, channels, and delivery performance.",
        "eligibleModes": [],
        "file": "",
        "video": "",
        "videoTitle": ""
      }
    },
    {
      "source": "Owner-supplied Women Techsters Bootcamp 5.0 collaborative case study",
      "payload": {
        "title": "Urban Population Dynamics & SDG 11",
        "slug": "urban-population-dynamics-sdg-11",
        "summary": "Analyzed urbanization, population density, migration, fertility, and urban pressure across 235 countries using 16 indicators aligned with Sustainable Development Goal 11.",
        "scope": "data",
        "featured": true,
        "order": 2,
        "cover": "",
        "alt": "",
        "category": "Women Techsters Bootcamp 5.0 · Synergy Team",
        "body": "## Project Overview\n\nUrban population growth creates increasing demands for housing, transport, energy, healthcare, and other essential services. This collaborative project examined population and urbanization indicators across 235 countries to explore how these factors relate to urban pressure and sustainable development.\n\nThe project aligned its analysis with Sustainable Development Goal 11 (SDG 11), which focuses on making cities and human settlements inclusive, safe, resilient, and sustainable.\n\n## Project Scope\n\n- Combine data from the World Bank and UN Population Division.\n- Standardize country identifiers and prepare data for analysis.\n- Examine urbanization, population density, fertility, migration, and population growth.\n- Develop categories and an urban pressure risk classification.\n- Build Power BI visualizations to communicate global patterns.\n\n## Dataset\n\nThe project covered 235 countries and 16 indicators, using data spanning 2024-2026 as documented in the original case study.\n\n## Deliverable\n\nA collaborative Power BI dashboard with global comparisons, risk classifications, and insights intended to support SDG 11 planning and further investigation.",
        "blocks": [
          {
            "heading": "Overview & problem",
            "body": "Urban growth is not uniform across countries. Differences in population density, migration, fertility, and urbanization can create different levels of pressure on infrastructure and public services.\n\nThe project explored how a consistent set of population indicators could help compare countries, identify patterns in urban pressure, and inform discussion around SDG 11.",
            "image": "",
            "alt": ""
          },
          {
            "heading": "My role & contributions",
            "body": "This was a collaborative project completed with Synergy Team during Women Techsters Bootcamp 5.0. The documented team workflow included:\n\n- Reviewing the SDG 11 context and defining analysis questions.\n- Standardizing country names and identifiers across datasets.\n- Preparing data for comparison and handling missing values.\n- Developing derived urbanization and population categories.\n- Contributing to analysis, visualization, and recommendations.\n\nUpdate this section in Admin to specify the tasks you personally completed.",
            "image": "",
            "alt": ""
          },
          {
            "heading": "Approach & outcomes",
            "body": "The team standardized country identifiers, integrated datasets, prepared missing values, and created derived classifications for urbanization and population size. Power BI was used to compare patterns across countries.\n\nKey findings reported in the case study:\n\n- 86.8% of countries were classified as low risk under the project's pressure index.\n- 10.6% were classified as medium risk.\n- 2.6% were classified as high risk.\n\nThese classifications are based on the project's own methodology and should not be interpreted as official UN risk classifications.",
            "image": "",
            "alt": ""
          },
          {
            "heading": "Recommendations",
            "body": "The findings suggest several areas for further investigation and planning:\n\n- Monitor countries experiencing rapid urbanization and population growth.\n- Consider migration trends when planning housing, transport, and public services.\n- Use comparable population indicators to identify areas for more detailed study.\n- Explore early-warning indicators for changes in urban pressure.\n- Align urban planning discussions with the relevant targets under SDG 11.\n\nRecommendations should be interpreted alongside country-specific context and verified source data before informing policy decisions.",
            "image": "",
            "alt": ""
          }
        ],
        "tools": ["Excel", "Power Query", "DAX", "Power BI", "Data Cleaning", "Data Visualization"],
        "links": [
          {
            "label": "Live Dashboard",
            "url": "https://synergy-team-dashboard.vercel.app/"
          },
          {
            "label": "Original Case Study",
            "url": "https://personal-portfolio-da.vercel.app/projects/urban-population-dynamics"
          }
        ],
        "externalUrl": "",
        "platform": "",
        "embedUrl": "",
        "embedTitle": "",
        "date": "2024-2026",
        "seoTitle": "Urban Population Dynamics & SDG 11 | Hassana Abdullahi",
        "seoDescription": "A collaborative Power BI analysis of urban population indicators across 235 countries in relation to SDG 11.",
        "eligibleModes": [],
        "file": "",
        "video": "",
        "videoTitle": ""
      }
    },
    {
      "source": "Owner-supplied Data Analysis portfolio case study; original case study supplied by the owner",
      "payload": {
        "title": "FMCG Sales Performance Dashboard - Nigeria Market, FY 2024",
        "slug": "fmcg-sales-performance-dashboard-fy-2024",
        "summary": "Designed an executive-style Power BI dashboard to analyze 3,600 simulated FMCG transactions across five Nigerian markets, four sales channels, and 15 products.",
        "scope": "data",
        "featured": true,
        "order": 3,
        "cover": "",
        "alt": "",
        "category": "Independent Project · Simulated Nigerian FMCG market",
        "body": "## Project Overview\n\nThis project presents a sales performance dashboard for a simulated Nigerian FMCG market covering the 2024 financial year. The dataset includes 3,600 transactions across five markets, four sales channels, five product categories, and 15 products.\n\nThe dashboard was designed to provide a consolidated view of sales and profitability while highlighting regional differences, seasonal trends, and potential stock availability issues.\n\n## Project Scope\n\n- Validate and prepare the transaction dataset.\n- Analyze revenue, cost, profit, and units sold.\n- Compare regional and channel performance.\n- Evaluate profitability across product categories.\n- Identify seasonal sales patterns and stockout risk.\n- Build an executive-friendly Power BI dashboard.\n\n## Dataset\n\nThe dataset was generated to simulate Nigerian FMCG operations from January to December 2024. It contains 3,600 records and 11 columns. It is a simulated dataset rather than actual company sales records.\n\n## Deliverable\n\nA single-page Power BI dashboard designed around KPI cards, monthly trends, regional comparisons, channel mix, category profitability, and stockout analysis.",
        "blocks": [
          {
            "heading": "Overview & problem",
            "body": "Sales stakeholders need to understand which markets and channels generate revenue, which product categories contribute the most profit, and where stock availability may constrain sales.\n\nThis project consolidates the main performance indicators into one dashboard, allowing users to examine overall results and explore differences by region, channel, category, and month.",
            "image": "",
            "alt": ""
          },
          {
            "heading": "My role & contributions",
            "body": "I developed the analysis and dashboard workflow, focusing on data quality, sales metrics, and clear visual communication.\n\nMy contributions included:\n\n- Reviewing the dataset and identifying the key business questions.\n- Checking missing values, duplicate records, date coverage, and numerical fields.\n- Preparing consistent fields for reporting.\n- Comparing sales performance across regions, channels, and categories.\n- Designing KPI cards and supporting visualizations in Power BI.\n- Summarizing findings and proposed business actions.",
            "image": "",
            "alt": ""
          },
          {
            "heading": "Dashboard & outcomes",
            "body": "The dashboard brings together key sales and operational measures.\n\nReported findings:\n\n- Total revenue of approximately NGN 69.1 million.\n- Gross profit of approximately NGN 22.4 million, representing about a 32% gross margin.\n- Approximately 126,000 units sold during the year.\n- Lagos led regional revenue, while also recording the highest reported stockout rate at 8.2%.\n- Dairy recorded the highest profit margin among the analyzed product categories.\n- Revenue increased during November and December.\n\nThese figures describe the project's simulated dataset, not verified commercial results.",
            "image": "",
            "alt": ""
          },
          {
            "heading": "Recommendations",
            "body": "The analysis suggests several potential actions:\n\n- Investigate stockout causes in Lagos and assess whether supply can keep pace with demand.\n- Monitor regional inventory and stockout patterns.\n- Evaluate the profitability of product categories when planning product mix.\n- Prepare inventory and promotions ahead of the November-December sales peak.\n- Assess the potential for online channel growth using actual channel costs and customer demand.\n\nThese recommendations should be validated with actual business data before operational decisions are made.",
            "image": "",
            "alt": ""
          }
        ],
        "tools": ["Excel", "Power Query", "Power BI", "DAX", "Data Cleaning", "Data Visualization"],
        "links": [
          {
            "label": "Original Case Study",
            "url": "https://personal-portfolio-da.vercel.app/projects/fmcg-sales-2024"
          }
        ],
        "externalUrl": "",
        "platform": "",
        "embedUrl": "",
        "embedTitle": "",
        "date": "January-December 2024",
        "seoTitle": "FMCG Sales Performance Dashboard FY 2024 | Hassana Abdullahi",
        "seoDescription": "An executive Power BI dashboard analyzing 3,600 simulated Nigerian FMCG transactions across markets, channels, products, and stockout risk.",
        "eligibleModes": [],
        "file": "",
        "video": "",
        "videoTitle": ""
      }
    }
  ]
  $records$::jsonb;
begin
  for item in select value from jsonb_array_elements(records) loop
    if exists (
      select 1
      from public.content_entries e
      left join public.content_revisions d on d.id = e.draft_id
      left join public.content_revisions p on p.id = e.published_id
      where e.kind = 'project'
        and (
          d.payload->>'slug' = item->'payload'->>'slug'
          or p.payload->>'slug' = item->'payload'->>'slug'
        )
    ) then
      raise notice 'Skipping existing project/%', item->'payload'->>'slug';
      continue;
    end if;

    insert into public.content_entries (kind, is_seed, source)
    values ('project', false, item->>'source')
    returning id into entry_id;

    insert into public.content_revisions (entry_id, payload)
    values (entry_id, item->'payload')
    returning id into revision_id;

    update public.content_entries
    set draft_id = revision_id, updated_at = now()
    where id = entry_id;
  end loop;
end;
$add_data_projects$;

commit;

select
  e.id as project_id,
  d.payload->>'title' as title,
  d.payload->>'slug' as slug,
  d.payload->>'scope' as scope,
  d.payload->>'featured' as featured,
  d.payload->>'order' as display_order,
  case when e.published_id is null then 'Draft' else 'Has published version' end as status,
  jsonb_array_length(d.payload->'blocks') as block_count
from public.content_entries e
join public.content_revisions d on d.id = e.draft_id
where e.kind = 'project'
  and d.payload->>'slug' in (
    'nigerian-fmcg-sales-analysis',
    'urban-population-dynamics-sdg-11',
    'fmcg-sales-performance-dashboard-fy-2024'
  )
order by (d.payload->>'order')::int;


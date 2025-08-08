import type { LoaderFunctionArgs } from "@remix-run/node";
import { redirect } from "@remix-run/node";
import { Form, useLoaderData } from "@remix-run/react";
import {
  FileText,
  Edit3,
  Eye,
  Search,
  Smartphone,
  Zap,
  CheckCircle,
  ArrowRight,
  Users,
  TrendingUp,
  Shield
} from "lucide-react";

import { login } from "../../shopify.server";
import styles from "./styles.module.css";

export const loader = async ({ request }: LoaderFunctionArgs) => {
  const url = new URL(request.url);

  if (url.searchParams.get("shop")) {
    throw redirect(`/app?${url.searchParams.toString()}`);
  }

  return { showForm: Boolean(login) };
};

export default function App() {
  const { showForm } = useLoaderData<typeof loader>();

  const features = [
    {
      icon: <Edit3 className={styles.featureIcon} />,
      title: "Rich Text Editor",
      description: "Create beautiful pages with our intuitive WYSIWYG editor. Add images, videos, and custom HTML with ease."
    },
    {
      icon: <Eye className={styles.featureIcon} />,
      title: "Live Preview",
      description: "See exactly how your pages will look before publishing. Real-time preview ensures perfect presentation."
    },
    {
      icon: <Search className={styles.featureIcon} />,
      title: "SEO Optimized",
      description: "Built-in SEO tools help your pages rank higher. Custom meta titles, descriptions, and URL handles included."
    },
    {
      icon: <Smartphone className={styles.featureIcon} />,
      title: "Mobile Responsive",
      description: "All pages automatically adapt to any screen size. Your content looks perfect on desktop, tablet, and mobile."
    },
    {
      icon: <Zap className={styles.featureIcon} />,
      title: "Lightning Fast",
      description: "Optimized for speed and performance. Your pages load instantly, improving user experience and SEO."
    },
    {
      icon: <FileText className={styles.featureIcon} />,
      title: "Template Library",
      description: "Choose from pre-built templates or create custom designs. Save time with professional layouts."
    }
  ];

  const benefits = [
    {
      icon: <Users className={styles.benefitIcon} />,
      stat: "50K+",
      label: "Happy Merchants",
      description: "Trusted by thousands of Shopify stores worldwide"
    },
    {
      icon: <TrendingUp className={styles.benefitIcon} />,
      stat: "85%",
      label: "Conversion Boost",
      description: "Average increase in page engagement rates"
    },
    {
      icon: <Shield className={styles.benefitIcon} />,
      stat: "99.9%",
      label: "Uptime",
      description: "Reliable service you can count on"
    }
  ];

  return (
    <div className={styles.index}>
      {/* Hero Section */}
      <section className={styles.hero}>
        <div className={styles.container}>
          <div className={styles.heroContent}>
            <div className={styles.heroText}>
              <div className={styles.badge}>
                <span>🚀 Now Available for Shopify</span>
              </div>
              <h1 className={styles.heroTitle}>
                Create Stunning Pages for Your Shopify Store
              </h1>
              <p className={styles.heroDescription}>
                The most powerful page builder for Shopify. Create landing pages,
                about us pages, and custom content that converts visitors into customers.
              </p>

              {showForm && (
                <Form className={styles.heroForm} method="post" action="/auth/login">
                  <div className={styles.formGroup}>
                    <input
                      className={styles.shopInput}
                      type="text"
                      name="shop"
                      placeholder="your-store.myshopify.com"
                      required
                    />
                    <button className={styles.installButton} type="submit">
                      Install Now
                      <ArrowRight className={styles.buttonIcon} />
                    </button>
                  </div>
                  <p className={styles.formHint}>
                    Free 14-day trial • No credit card required
                  </p>
                </Form>
              )}
            </div>

            <div className={styles.heroVisual}>
              <div className={styles.mockup}>
                <div className={styles.mockupScreen}>
                  <div className={styles.mockupHeader}>
                    <div className={styles.mockupDots}>
                      <span></span>
                      <span></span>
                      <span></span>
                    </div>
                  </div>
                  <div className={styles.mockupContent}>
                    <div className={styles.mockupPage}>
                      <div className={styles.mockupTitle}></div>
                      <div className={styles.mockupText}></div>
                      <div className={styles.mockupButton}></div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className={styles.features}>
        <div className={styles.container}>
          <div className={styles.sectionHeader}>
            <h2 className={styles.sectionTitle}>
              Everything You Need to Create Amazing Pages
            </h2>
            <p className={styles.sectionDescription}>
              Powerful features designed specifically for Shopify merchants
            </p>
          </div>

          <div className={styles.featuresGrid}>
            {features.map((feature, index) => (
              <div key={index} className={styles.featureCard}>
                <div className={styles.featureIconWrapper}>
                  {feature.icon}
                </div>
                <h3 className={styles.featureTitle}>{feature.title}</h3>
                <p className={styles.featureDescription}>{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className={styles.benefits}>
        <div className={styles.container}>
          <div className={styles.benefitsContent}>
            <div className={styles.benefitsText}>
              <h2 className={styles.benefitsTitle}>
                Join Thousands of Successful Shopify Stores
              </h2>
              <p className={styles.benefitsDescription}>
                Our page builder has helped merchants create high-converting pages
                that drive sales and improve customer experience.
              </p>

              <div className={styles.checkList}>
                <div className={styles.checkItem}>
                  <CheckCircle className={styles.checkIcon} />
                  <span>No coding skills required</span>
                </div>
                <div className={styles.checkItem}>
                  <CheckCircle className={styles.checkIcon} />
                  <span>Works with any Shopify theme</span>
                </div>
                <div className={styles.checkItem}>
                  <CheckCircle className={styles.checkIcon} />
                  <span>24/7 customer support</span>
                </div>
                <div className={styles.checkItem}>
                  <CheckCircle className={styles.checkIcon} />
                  <span>Regular updates and new features</span>
                </div>
              </div>
            </div>

            <div className={styles.benefitsStats}>
              {benefits.map((benefit, index) => (
                <div key={index} className={styles.benefitCard}>
                  <div className={styles.benefitIconWrapper}>
                    {benefit.icon}
                  </div>
                  <div className={styles.benefitContent}>
                    <div className={styles.benefitStat}>{benefit.stat}</div>
                    <div className={styles.benefitLabel}>{benefit.label}</div>
                    <div className={styles.benefitDescription}>{benefit.description}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className={styles.cta}>
        <div className={styles.container}>
          <div className={styles.ctaContent}>
            <h2 className={styles.ctaTitle}>
              Ready to Create Amazing Pages?
            </h2>
            <p className={styles.ctaDescription}>
              Start building professional pages for your Shopify store today.
              No setup fees, no long-term contracts.
            </p>

            {showForm && (
              <Form className={styles.ctaForm} method="post" action="/auth/login">
                <input
                  className={styles.ctaInput}
                  type="text"
                  name="shop"
                  placeholder="your-store.myshopify.com"
                  required
                />
                <button className={styles.ctaButton} type="submit">
                  Get Started Free
                </button>
              </Form>
            )}

            <div className={styles.ctaFeatures}>
              <span>✓ 14-day free trial</span>
              <span>✓ No credit card required</span>
              <span>✓ Setup in 2 minutes</span>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
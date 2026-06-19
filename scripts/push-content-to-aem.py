#!/usr/bin/env python3
"""Push mock content into AEM jcr:content node via Sling POST servlet."""

import json, sys, base64, urllib.request, urllib.parse

AEM = "http://localhost:4502"
AUTH = base64.b64encode(b"admin:admin").decode()
BASE = f"{AEM}/content/ue-demo/en/home/jcr:content"

def set_props(url, props):
    data = urllib.parse.urlencode(props, doseq=True).encode()
    req = urllib.request.Request(url, data=data, method="POST")
    req.add_header("Authorization", f"Basic {AUTH}")
    req.add_header("Content-Type", "application/x-www-form-urlencoded;charset=utf-8")
    try:
        resp = urllib.request.urlopen(req)
        print(f"  OK {url} -> {resp.status}")
    except urllib.error.HTTPError as e:
        print(f"  WARN: {url} -> {e.code}")

def main():
    print("=== Pushing content to AEM ===\n")

    # -- Nav Links --
    print("navLinks")
    set_props(f"{BASE}/navLinks", {
        "jcr:primaryType": "nt:unstructured",
        "item0/jcr:primaryType": "nt:unstructured", "item0/label": "Home", "item0/url": "/",
        "item1/jcr:primaryType": "nt:unstructured", "item1/label": "About", "item1/url": "/about",
        "item2/jcr:primaryType": "nt:unstructured", "item2/label": "Services", "item2/url": "/services",
        "item3/jcr:primaryType": "nt:unstructured", "item3/label": "Portfolio", "item3/url": "/portfolio",
        "item4/jcr:primaryType": "nt:unstructured", "item4/label": "Contact", "item4/url": "/contact",
    })

    # -- Hero --
    print("hero")
    set_props(f"{BASE}/hero", {
        "jcr:primaryType": "nt:unstructured",
        "sling:resourceType": "ue-demo/components/hero",
        "title": "Transform Your Digital Presence",
        "subtitle": "We build experiences that drive growth",
        "description": "<p>Nexus Digital is a full-service digital experience agency. We help brands create meaningful connections with their audiences through innovative design, cutting-edge technology, and data-driven strategies.</p>",
        "ctaLabel": "Get Started", "ctaUrl": "/contact",
        "bgImage": "https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=1920&q=80",
    })

    # -- Logo Cloud --
    print("logocloud")
    set_props(f"{BASE}/logocloud", {
        "jcr:primaryType": "nt:unstructured",
        "sling:resourceType": "ue-demo/components/logocloud",
        "heading": "Trusted by Industry Leaders",
    })

    # -- Card Grid --
    print("cardgrid")
    set_props(f"{BASE}/cardgrid", {
        "jcr:primaryType": "nt:unstructured",
        "sling:resourceType": "ue-demo/components/cardgrid",
        "heading": "Our Services",
    })
    set_props(f"{BASE}/cardgrid/services", {
        "jcr:primaryType": "nt:unstructured",
        "item0/jcr:primaryType": "nt:unstructured",
        "item0/title": "UI/UX Design",
        "item0/description": "We create intuitive, user-centered designs that delight users and drive engagement across all digital touchpoints.",
        "item0/image": "https://images.unsplash.com/photo-1561070791-2526d30994b5?w=800&q=80",
        "item0/ctaLabel": "Learn More", "item0/ctaUrl": "#", "item0/category": "Design",
        "item1/jcr:primaryType": "nt:unstructured",
        "item1/title": "Web Development",
        "item1/description": "From React SPAs to AEM-powered sites, we build fast, scalable, and maintainable web applications using modern tech stacks.",
        "item1/image": "https://images.unsplash.com/photo-1461749280684-dccba630e2f6?w=800&q=80",
        "item1/ctaLabel": "Explore", "item1/ctaUrl": "#", "item1/category": "Web App",
        "item2/jcr:primaryType": "nt:unstructured",
        "item2/title": "Digital Strategy",
        "item2/description": "Data-driven strategies that align your business goals with user needs, ensuring measurable results and sustainable growth.",
        "item2/image": "https://images.unsplash.com/photo-1553877522-43269d4ea984?w=800&q=80",
        "item2/ctaLabel": "Discover", "item2/ctaUrl": "#", "item2/category": "Cloud",
        "item3/jcr:primaryType": "nt:unstructured",
        "item3/title": "Cloud & DevOps",
        "item3/description": "End-to-end cloud infrastructure, CI/CD pipelines, and AEM managed services to keep your digital experience running smoothly.",
        "item3/image": "https://images.unsplash.com/photo-1667372393119-3d4c48d07fc9?w=800&q=80",
        "item3/ctaLabel": "See More", "item3/ctaUrl": "#", "item3/category": "Cloud",
        "item4/jcr:primaryType": "nt:unstructured",
        "item4/title": "Content Strategy",
        "item4/description": "Compelling content that tells your brand story, optimized for SEO and personalized across every customer touchpoint.",
        "item4/image": "https://images.unsplash.com/photo-1552664730-d307ca884978?w=800&q=80",
        "item4/ctaLabel": "Learn More", "item4/ctaUrl": "#", "item4/category": "Design",
        "item5/jcr:primaryType": "nt:unstructured",
        "item5/title": "Analytics & Optimization",
        "item5/description": "Measure, analyze, and optimize your digital experiences with actionable insights and A/B testing at scale.",
        "item5/image": "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800&q=80",
        "item5/ctaLabel": "Get Insights", "item5/ctaUrl": "#", "item5/category": "Web App",
    })

    # -- Why Section --
    print("whysection")
    set_props(f"{BASE}/whysection", {
        "jcr:primaryType": "nt:unstructured",
        "sling:resourceType": "ue-demo/components/richtextsection",
        "heading": "Why Nexus Digital?",
        "body": "<p>We combine creative design with technical excellence to deliver digital experiences that drive measurable results. Our team of strategists, designers, and engineers work collaboratively to transform complex challenges into elegant solutions.</p><p>From startups to enterprise, we have helped hundreds of organizations establish and scale their digital presence with confidence.</p>",
        "approachHeading": "Our Approach",
        "approachDescription": "Every project begins with deep research and strategic thinking. We believe in data-driven design decisions and iterative development that puts your users first.",
    })

    # -- Teaser --
    print("teaser")
    set_props(f"{BASE}/teaser", {
        "jcr:primaryType": "nt:unstructured",
        "sling:resourceType": "ue-demo/components/teaser",
        "image": "https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=1920&q=80",
        "title": "Ready to Transform Your Digital Experience?",
        "description": "Join hundreds of companies that trust Nexus Digital to build, scale, and optimize their digital presence. Let's create something extraordinary together.",
        "ctaLabel": "Start Your Project", "ctaUrl": "/contact",
    })

    # -- Stats Bar --
    print("statsbar")
    set_props(f"{BASE}/statsbar", {
        "jcr:primaryType": "nt:unstructured",
        "sling:resourceType": "ue-demo/components/statsbar",
        "heading": "Our Impact by the Numbers",
    })
    set_props(f"{BASE}/statsbar/stats", {
        "jcr:primaryType": "nt:unstructured",
        "item0/jcr:primaryType": "nt:unstructured", "item0/value": "500+", "item0/label": "Clients",
        "item1/jcr:primaryType": "nt:unstructured", "item1/value": "50M+", "item1/label": "Users Served",
        "item2/jcr:primaryType": "nt:unstructured", "item2/value": "98%", "item2/label": "Satisfaction Rate",
        "item3/jcr:primaryType": "nt:unstructured", "item3/value": "15+", "item3/label": "Years Experience",
    })

    # -- Testimonial --
    print("testimonial")
    set_props(f"{BASE}/testimonial", {
        "jcr:primaryType": "nt:unstructured",
        "sling:resourceType": "ue-demo/components/testimonial",
        "quote": "<p>Nexus Digital transformed our online presence completely. The team's expertise and dedication exceeded our expectations.</p>",
        "author": "Sarah Chen", "role": "CEO, TechVista Solutions",
        "avatar": "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=200&q=80",
    })

    # -- Accordion FAQ --
    print("accordion")
    set_props(f"{BASE}/accordion", {
        "jcr:primaryType": "nt:unstructured",
        "sling:resourceType": "ue-demo/components/accordion",
        "heading": "Frequently Asked Questions",
    })
    set_props(f"{BASE}/accordion/accordionItems", {
        "jcr:primaryType": "nt:unstructured",
        "item0/jcr:primaryType": "nt:unstructured",
        "item0/title": "What services does Nexus Digital offer?",
        "item0/content": "<p>We offer a comprehensive range of digital services including UI/UX design, web development, digital strategy, cloud & DevOps, content strategy, and analytics & optimization. Our team of 50+ specialists works across industries to deliver end-to-end digital experiences.</p>",
        "item1/jcr:primaryType": "nt:unstructured",
        "item1/title": "How long does a typical project take?",
        "item1/content": "<p>Project timelines vary based on scope and complexity. A typical website redesign takes 8-16 weeks from discovery to launch. Larger transformation projects can take 3-6 months. We'll provide a detailed timeline during our initial consultation.</p>",
        "item2/jcr:primaryType": "nt:unstructured",
        "item2/title": "Do you work with AEM projects?",
        "item2/content": "<p>Yes! We are AEM specialists. Our team has extensive experience with Adobe Experience Manager including AEM as a Cloud Service, content fragment models, headless implementations, Universal Editor integration, and custom component development.</p>",
        "item3/jcr:primaryType": "nt:unstructured",
        "item3/title": "What is your pricing model?",
        "item3/content": "<p>We offer flexible pricing models including project-based fixed pricing, time & materials, and dedicated team engagement. Contact us for a customized proposal based on your specific requirements and budget.</p>",
    })

    # -- Link List --
    print("linklist")
    set_props(f"{BASE}/linklist", {
        "jcr:primaryType": "nt:unstructured",
        "sling:resourceType": "ue-demo/components/linklist",
        "heading": "Related Resources",
    })
    set_props(f"{BASE}/linklist/links", {
        "jcr:primaryType": "nt:unstructured",
        "item0/jcr:primaryType": "nt:unstructured", "item0/label": "Case Studies", "item0/url": "#",
        "item1/jcr:primaryType": "nt:unstructured", "item1/label": "Documentation", "item1/url": "#",
        "item2/jcr:primaryType": "nt:unstructured", "item2/label": "Blog & Insights", "item2/url": "#",
        "item3/jcr:primaryType": "nt:unstructured", "item3/label": "Resource Library", "item3/url": "#",
    })

    # -- Newsletter --
    print("newslettersection")
    set_props(f"{BASE}/newslettersection", {
        "jcr:primaryType": "nt:unstructured",
        "sling:resourceType": "ue-demo/components/newslettersection",
    })

    # -- Mission Section --
    print("missionsection")
    set_props(f"{BASE}/missionsection", {
        "jcr:primaryType": "nt:unstructured",
        "sling:resourceType": "ue-demo/components/richtextsection",
        "heading": "Our Mission & Values",
        "subtitle": "We believe in building technology that makes a real difference",
    })
    set_props(f"{BASE}/missionsection/missionItems", {
        "jcr:primaryType": "nt:unstructured",
        "item0/jcr:primaryType": "nt:unstructured", "item0/icon": "\U0001f3af", "item0/title": "Purpose-Driven", "item0/desc": "Every project starts with understanding your core mission and goals.",
        "item1/jcr:primaryType": "nt:unstructured", "item1/icon": "\U0001f91d", "item1/title": "Collaborative", "item1/desc": "We partner closely with your team, ensuring alignment at every stage.",
        "item2/jcr:primaryType": "nt:unstructured", "item2/icon": "\U0001f52c", "item2/title": "Data-Informed", "item2/desc": "Design and development decisions are backed by research and analytics.",
        "item3/jcr:primaryType": "nt:unstructured", "item3/icon": "\U0001f680", "item3/title": "Results-Focused", "item3/desc": "We measure success by the tangible impact delivered to your business.",
    })

    # -- Team Section --
    print("teamsection")
    set_props(f"{BASE}/teamsection", {
        "jcr:primaryType": "nt:unstructured",
        "sling:resourceType": "ue-demo/components/teamsection",
        "heading": "Leadership Team",
        "subtitle": "Meet the people driving digital innovation at Nexus Digital",
    })

    # -- Story --
    print("story")
    set_props(f"{BASE}/story", {
        "jcr:primaryType": "nt:unstructured",
        "sling:resourceType": "ue-demo/components/richtextsection",
        "heading": "Our Story",
        "body": "<p>Founded in 2011, Nexus Digital started as a small team of passionate designers and developers with a shared vision: to create digital experiences that truly make a difference. Over the past 15 years, we've grown into a full-service digital agency with over 50 specialists across strategy, design, development, and operations.</p><p>Our journey has been defined by a relentless commitment to innovation, quality, and client success. We've had the privilege of working with Fortune 500 companies, ambitious startups, and everything in between.</p>",
        "image": "https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=800&q=80",
    })

    # -- Process Steps --
    print("processsteps")
    set_props(f"{BASE}/processsteps", {
        "jcr:primaryType": "nt:unstructured",
        "sling:resourceType": "ue-demo/components/processsteps",
        "heading": "Our Process",
        "subtitle": "A proven methodology that delivers results",
    })

    # -- Pricing Table --
    print("pricingtable")
    set_props(f"{BASE}/pricingtable", {
        "jcr:primaryType": "nt:unstructured",
        "sling:resourceType": "ue-demo/components/pricingtable",
        "heading": "Pricing Plans",
        "subtitle": "Flexible plans to fit your needs",
    })

    # -- Contact Form --
    print("contactform")
    set_props(f"{BASE}/contactform", {
        "jcr:primaryType": "nt:unstructured",
        "sling:resourceType": "ue-demo/components/contactform",
        "heading": "Send Us a Message",
        "formNameLabel": "Full Name", "formNamePlaceholder": "John Doe",
        "formEmailLabel": "Email Address", "formEmailPlaceholder": "john@example.com",
        "formSubjectLabel": "Subject",
        "formMessageLabel": "Your Message", "formMessagePlaceholder": "Tell us about your project...",
        "formCheckboxLabel": "I agree to the privacy policy",
        "formRadioLabel": "Preferred contact method",
        "formSubmitLabel": "Send Message",
    })
    set_props(f"{BASE}/contactform/subjectOptions", {
        "jcr:primaryType": "nt:unstructured",
        "item0/jcr:primaryType": "nt:unstructured", "item0/label": "General Inquiry", "item0/value": "general",
        "item1/jcr:primaryType": "nt:unstructured", "item1/label": "Project Quote", "item1/value": "quote",
        "item2/jcr:primaryType": "nt:unstructured", "item2/label": "Support", "item2/value": "support",
    })
    set_props(f"{BASE}/contactform/radioOptions", {
        "jcr:primaryType": "nt:unstructured",
        "item0/jcr:primaryType": "nt:unstructured", "item0/label": "Email", "item0/value": "email",
        "item1/jcr:primaryType": "nt:unstructured", "item1/label": "Phone", "item1/value": "phone",
    })

    # -- CTA Section --
    print("ctasection")
    set_props(f"{BASE}/ctasection", {
        "jcr:primaryType": "nt:unstructured",
        "heading": "Ready to Start Your Project?",
        "subtitle": "Let's build something remarkable together",
        "ctaLabel": "Let's Build Something Together",
    })

    # -- Related Content (on jcr:content directly) --
    print("related properties")
    set_props(BASE, {
        "relatedHeading": "Related Resources",
        "relatedSubtitle": "Explore helpful guides and documentation",
    })

    print("\n=== Content push complete ===")

if __name__ == "__main__":
    main()

import { Injectable } from '@angular/core';
import { Meta, Title } from '@angular/platform-browser';
import { ActivatedRoute, NavigationEnd, Router } from '@angular/router';
import { filter, map, mergeMap } from 'rxjs/operators';

interface RouteMetadata {
  title?: string;
  description?: string;
  ogImage?: string;
  twitterCard?: string;
}

@Injectable({ providedIn: 'root' })
export class MetadataService {
  private readonly defaults: Required<RouteMetadata> = {
    title: 'AI Resume Builder',
    description:
      'AI Resume Builder is the easiest way to create a professional resume that will help you land your dream job using AI technology.',
    ogImage: '/assets/images/opengraph-image.png',
    twitterCard: 'summary_large_image',
  };

  constructor(
    private title: Title,
    private meta: Meta,
    private router: Router,
    private activatedRoute: ActivatedRoute,
  ) {
    this.router.events
      .pipe(
        filter((event) => event instanceof NavigationEnd),
        map(() => this.activatedRoute),
        map((route) => {
          while (route.firstChild) route = route.firstChild;
          return route;
        }),
        mergeMap((route) => route.data),
      )
      .subscribe((data) => {
        this.updateMetadata(data as RouteMetadata);
      });
  }

  private updateMetadata(data: RouteMetadata) {
    const meta = { ...this.defaults, ...data };

    const isHome = this.router.url === '/' || !data.title;
    const pageTitle = isHome ? this.defaults.title : `${meta.title} - AI Resume Builder`;

    this.title.setTitle(pageTitle);

    this.meta.updateTag({ name: 'description', content: meta.description }, "name='description'");

    // Open Graph
    this.meta.updateTag({ property: 'og:title', content: pageTitle }, "property='og:title'");
    this.meta.updateTag(
      { property: 'og:description', content: meta.description },
      "property='og:description'",
    );
    this.meta.updateTag({ property: 'og:image', content: meta.ogImage }, "property='og:image'");

    // Twitter
    this.meta.updateTag({ name: 'twitter:card', content: meta.twitterCard }, "name='twitter:card'");
    this.meta.updateTag({ name: 'twitter:title', content: pageTitle }, "name='twitter:title'");
    this.meta.updateTag(
      { name: 'twitter:description', content: meta.description },
      "name='twitter:description'",
    );
    this.meta.updateTag({ name: 'twitter:image', content: meta.ogImage }, "name='twitter:image'");
  }
}

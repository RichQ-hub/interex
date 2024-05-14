// import CreateCommunityModal from '@/components/CreateCommunityModal';
// import CommunityService from '@/services/CommunityService';

// export default async function CommunityModal() {
//   const categories = await CommunityService.getAllCategories();
//   return (
//     <CreateCommunityModal categories={categories} />
//   )
// }

/**
 * This uses a concept known as parallel routing, where we can essentially
 * create slots that act like mini-applications that have their own navigations.
 * This can be useful when creating modals. How they work is that when navigating
 * to /communities/create, it will render what's inside of /create/page.tsx
 * and insert it into the place where the props.modal slot is positioned inside
 * of /communities/layout.tsx.
 * 
 * Resources:
 * - https://nextjs.org/docs/app/building-your-application/routing/parallel-routes#modals
 * - https://www.builder.io/blog/nextjs-14-parallel-routes
 */

/**
 * Why does hardcoding /communities/create in the browser return 404 not found? Shouldn't it open the modal?
 * https://stackoverflow.com/questions/77327831/next-js-parallel-routes-dont-work-getting-404
 */
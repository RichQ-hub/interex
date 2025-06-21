export default async function Layout(props: {
  children: React.ReactNode,
  modal: React.ReactNode,
}) {
  return (
    <>
      {props.children}
      {props.modal}
    </>
  )
}

/**
 * NO LONGER USED!
 * We are no longer using parallel routing for @modal due to the bugs occuring when
 * calling redirect() in next actions, which seems to break the parallel routing.
 */

/**
 * Since the 'children' prop inside of the layout.tsx file is considered a slot like @modal,
 * then it must also have a default.tsx file that gets rendered when refreshing the page.
 * 
 * In the case of the route '/communities':
 * Since this does not match any of the routes inside of @modal folder,
 * namely the /create folder, then what gets rendered in the above props.modal
 * slot will be whats defined inside default.tsx inside @modal.
 * 
 * In the case of the route '/communities/create':
 * This will match the route inside of @modal/create, which will then render 
 * whatever is inside of @modal/create/page.tsx, which is the modal and be placed
 * inside of props.modal above.
 * 
 * What happens on refresh:
 * Say we were on '/communities/create' and we reload the page. Since /create still
 * matches one of routes inside of @modal, then it will continue rendering the modal.
 * However, for the children slot, it does not have a corresponding /create route inside
 * of it, and hence nextjs will try to find default.tsx to render that, which we 
 * have defined in '/communities/default.tsx'
 * 
 * Better explanation here (Go to the unmatched routes section):
 * https://www.builder.io/blog/nextjs-14-parallel-routes
 */
import { createClientFromRequest } from 'npm:@base44/sdk@0.8.4';
import Stripe from 'npm:stripe@17.5.0';

const stripe = new Stripe(Deno.env.get('STRIPE_SECRET_KEY'));

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    const user = await base44.auth.me();

    if (!user) {
      return Response.json({ error: 'Unauthorized' }, { status: 401 });
    }

    if (!user.stripe_customer_id) {
      return Response.json({ error: 'No subscription found. Please subscribe first.' }, { status: 400 });
    }

    const BASE_URL = Deno.env.get('BASE_URL') || 'https://rosierides.base44.app';

    // Create a portal session
    const session = await stripe.billingPortal.sessions.create({
      customer: user.stripe_customer_id,
      return_url: `${BASE_URL}/#/ManageSubscription`,
    });

    return Response.json({ url: session.url });
  } catch (error) {
    console.error('Portal session error:', error);
    return Response.json({ error: error.message }, { status: 500 });
  }
});
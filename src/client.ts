import {
  PocketsflowConfig,
  PocketsflowError,
  FeatureLockedError,
  SeatLimitError,
  Product,
  CreateProductParams,
  UpdateProductParams,
  CopyCatalogItemParams,
  ProductVariant,
  CreateVariantParams,
  Customer,
  ListOrdersParams,
  OrdersResponse,
  OrderDetail,
  ListCustomersParams,
  CustomerDetail,
  Review,
  ListReviewsParams,
  Discount,
  CreateDiscountParams,
  UpdateDiscountParams,
  Upsell,
  UpsellsResponse,
  CreateUpsellParams,
  UpdateUpsellParams,
  ListSubscriptionsParams,
  SubscriberOrderHistory,
  SubscriberDetail,
  ListSubscribersParams,
  SubscribersResponse,
  GetSubscriberParams,
  MembershipActionResult,
  PaymentDetail,
  ListPaymentsParams,
  PaymentsResponse,
  GetPaymentParams,
  SubscriptionOffer,
  CreateSubscriptionOfferParams,
  DeletedSubscriptionOffer,
  Webhook,
  CreatedWebhook,
  CreateWebhookParams,
  UpdateWebhookParams,
  WebhookSecretRotation,
  WebhookTestResult,
  WebhookDelivery,
  ListWebhookDeliveriesParams,
  WebhookDeliveriesResponse,
  WebhookRedeliveryResult,
  User,
  UpdateUserParams,
  CreateCheckoutParams,
  CheckoutSession,
  RefundPolicy,
  CreateRefundPolicyParams,
  UpdateRefundPolicyParams,
  EmailSubscriber,
  ListEmailSubscribersParams,
  ProductAudience,
  SyncAudienceParams,
  AudienceSyncResult,
  Post,
  ListPostsParams,
  CreatePostParams,
  UpdatePostParams,
  SendPostResult,
  SendEmailParams,
  SendEmailResult,
  CreatorPage,
  CreateCreatorPageParams,
  UpdateCreatorPageParams,
  CreatorPageUsernameUpdate,
  ImageUploadInput,
  UploadImageOptions,
  UploadedImage,
  Partner,
  PartnerListParams,
  PartnerListResponse,
  PartnerStats,
  ReferredUser,
  ReferralSale,
  ReferralRegistration,
  Entitlements,
  EntitlementsResult,
  FeatureKey,
  Plan,
  AbandonedCheckoutSummary,
  ProductAbandonedCheckout,
  UpdateTrackingPixelsParams,
  SellingProfile,
  UpdateSellingProfileParams,
  WeeklyReportPreview,
  WeeklyReportSettings,
  UpdateWeeklyReportSettingsParams,
  TrackedLink,
  ListTrackedLinksParams,
  TrackedLinkListResponse,
  TrackedLinkStatsParams,
  TrackedLinkStatsResponse,
  CreateTrackedLinkParams,
  UpdateTrackedLinkParams,
  TrackedLinkSlugCheck,
  StoreBadge,
  StoreBadgeReferralStats,
  UpdateStoreBadgeParams,
  TeamOverview,
  ListTeamActivityParams,
  TeamActivityResponse,
  InviteTeamMemberParams,
  TeamInviteCreated,
  TeamInviteResent,
  UpdateTeamMemberParams,
  TeamMemberUpdate,
  CreateTeamParams,
  UpdateTeamParams,
  TeamRecord,
  TeamOk,
  PostPurchaseOffer,
  UpdatePostPurchaseOfferParams,
  SocialProof,
  SocialProofSettings,
  UpdateSocialProofSettingsParams,
  FunnelTemplate,
  ListFunnelTemplatesParams,
  FunnelListItem,
  Funnel,
  FunnelDetail,
  FunnelAnalytics,
  CreateFunnelParams,
  LicenseKey,
  ListLicenseKeysParams,
  LicenseKeysResponse,
  LicenseKeyCheckParams,
  DeactivateLicenseKeyParams,
  LicenseValidation,
  AbAssignment,
  AbTest,
  AbTestResults,
  AbTestTimezoneParams,
  AbTestWinner,
  AccountManagerView,
  AdjustLoyaltyPointsParams,
  AffiliateBonusesResponse,
  AffiliateProgram,
  AffiliateTierProgressDetail,
  AffiliateTierProgressList,
  Agency,
  AgencyOverview,
  AgencyPreview,
  AgencyStatement,
  AgencyStatementRow,
  AnalyticsPreview,
  AnalyticsRangeParams,
  AnalyticsSummary,
  AppliedDiscount,
  ApplyDiscountOptions,
  AssignAbTestVariantParams,
  AttributionReport,
  AttributionReportParams,
  AttributionSurvey,
  BanMemberParams,
  Benchmarks,
  Bundle,
  Certificate,
  CheckoutOfferSettings,
  CheckoutOffers,
  CommunityReply,
  CommunityThread,
  CommunityThreadDetail,
  CommunityThreadsPage,
  CourseLessonQuiz,
  CourseQuiz,
  CourseSettings,
  CourseStats,
  CreateAbTestParams,
  CreateAgencyParams,
  CreateCommunityThreadParams,
  CreateDisputeHelpParams,
  CreateFlashSaleAnnouncementParams,
  CreateFlashSaleParams,
  CreateMemberPostParams,
  CreateMembershipParams,
  CreateMigrationParams,
  CreatePersonalDeadlineParams,
  CreateRevenueSplitParams,
  CreateSegmentParams,
  CreateSignupFormParams,
  CreateUniqueCodesParams,
  CreatedUniqueCodes,
  CreatorCard,
  CreatorServices,
  CustomerNote,
  CustomerProfile,
  CustomerProfilesPage,
  DeletedResult,
  DisputeCover,
  DisputeHelpRequest,
  DownloadLimits,
  ExitOfferUpdate,
  ExportUniqueCodesParams,
  FairPricingAnalytics,
  FairPricingAnalyticsParams,
  FairPricingResponse,
  FlashSale,
  FlashSaleAnnouncement,
  FlashSaleListResponse,
  GetUsageParams,
  IntroPricingReport,
  LimitedDrop,
  LimitedDropAvailability,
  ListAbTestsParams,
  ListAffiliateBonusesParams,
  ListAtRiskParams,
  ListCommunityThreadsParams,
  ListCustomerProfilesParams,
  ListDisputeCoversParams,
  ListDisputeHelpParams,
  ListFlashSalesParams,
  ListLoyaltyActivityParams,
  ListLoyaltyMembersParams,
  ListMembershipMembersParams,
  ListMigrationRowsParams,
  ListPersonalDeadlineEntriesParams,
  ListReferredStoresParams,
  ListRevenueSplitSalesParams,
  ListRevenueSplitsParams,
  ListSegmentSubscribersParams,
  ListSignupFormsParams,
  ListTestimonialsParams,
  ListUniqueCodesParams,
  LoyaltyActivityResponse,
  LoyaltyAdjustment,
  LoyaltyMembersResponse,
  LoyaltySettings,
  LoyaltySummary,
  MemberBanResult,
  MemberPost,
  MemberPostParams,
  MemberPostsPage,
  Membership,
  MembershipMembersPage,
  MessageResult,
  MigrationConnectResult,
  MigrationDryRun,
  MigrationFileInput,
  MigrationFileResult,
  MigrationJob,
  MigrationKind,
  MigrationListResponse,
  MigrationPlatform,
  SearchParams,
  SearchResponse,
  PennyDecideParams,
  PennyDecision,
  PennyUsage,
  MigrationReport,
  MigrationRowsPage,
  ModerateCommunityThreadParams,
  ModerateTestimonialParams,
  MrrParams,
  MrrReport,
  MyAffiliateTierProgress,
  NetRevenue,
  NetRevenueParams,
  OkResult,
  OrderDownloads,
  PaginationParams,
  PaidNewsletter,
  PaidNewsletterStats,
  PaidNewsletterSyncResult,
  PaymentPlanSettings,
  PaymentRecoveryPage,
  PdfStamping,
  PersonalDeadline,
  PersonalDeadlineEntriesResponse,
  PersonalDeadlineLink,
  PersonalOffer,
  PersonalOfferParams,
  PostResend,
  PriceQuote,
  PriceQuoteParams,
  PriceStepsOverview,
  ProductFairPricing,
  ProductFairPricingUpdate,
  ProductLaunchPricing,
  ProductPriceStepsUpdate,
  ProductRevenueSplit,
  PublicSignupForm,
  RecommendationSettings,
  RecoverySettings,
  RecoverySummary,
  RecoverySummaryParams,
  ReferralStats,
  ReferredStoresPage,
  RepeatBuyerCohorts,
  RepeatBuyerCohortsParams,
  ReportUsageParams,
  ReportUsageResponse,
  RequestSlackChannelParams,
  ResendToNonOpenersParams,
  RetentionOffer,
  RetentionOffersList,
  RevenueBySource,
  RevenueBySourceParams,
  RevenueSplit,
  RevenueSplitEarnings,
  RevenueSplitEarningsParams,
  RevenueSplitSale,
  RevenueSplitSalesResponse,
  SalesFunnelReport,
  SaveOffersReport,
  SaveOffersReportParams,
  Segment,
  SegmentCount,
  SegmentDefinition,
  SegmentListResponse,
  SegmentPreview,
  SegmentSubscribersResponse,
  SetPostAudienceParams,
  SetPriceStepsParams,
  SetSpreadsheetParams,
  SheetsConnection,
  SheetsRetryResult,
  SheetsSyncNowResult,
  SheetsSyncState,
  SignupForm,
  SignupFormDetail,
  SignupFormSubscribeParams,
  SignupFormSubscribeResult,
  StartSubjectTestParams,
  StoreAgency,
  SubjectTest,
  Testimonial,
  TestimonialList,
  TestimonialSettings,
  TestimonialWall,
  TieredDiscounts,
  UniqueCodesResponse,
  UpdateAffiliateTiersParams,
  UpdateAgencyParams,
  UpdateAttributionSurveyParams,
  UpdateBundleParams,
  UpdateCourseSettingsParams,
  UpdateDownloadLimitsParams,
  UpdateExitOfferParams,
  UpdateFairPricingParams,
  UpdateFlashSaleParams,
  UpdateLimitedDropParams,
  UpdateLoyaltySettingsParams,
  UpdateMembershipParams,
  UpdatePaidNewsletterParams,
  UpdatePaymentPlanParams,
  UpdatePersonalDeadlineParams,
  UpdateRecommendationsParams,
  UpdateRecoverySettingsParams,
  UpdateRetentionOfferParams,
  UpdateSeatsParams,
  UpdateSeatsResponse,
  UpdateSegmentParams,
  UpdateSheetsSyncParams,
  UpdateSignupFormParams,
  UpdateTestimonialSettingsParams,
  UpdateTieredDiscountsParams,
  UpdateUsagePricingResponse,
  UsagePricing,
  UsageSummary,
  OrderJourney,
  OrderPaymentDetails,
  Payout,
  PayoutBalance,
  PayoutStatus,
  ListPayoutsParams,
  PayoutsResponse,
} from './types';

const DEFAULT_BASE_URL = 'https://api.pocketsflow.com';
const DEFAULT_TIMEOUT = 30000;

/** Encode a caller-supplied id for use as one path segment. */
const seg = (id: string): string => encodeURIComponent(id);

/** Add the non-enumerable `can()` helper to an entitlements payload. */
function withCan(entitlements: Entitlements): EntitlementsResult {
  Object.defineProperty(entitlements, 'can', {
    value: (key: FeatureKey): boolean => entitlements.features?.[key]?.allowed === true,
    enumerable: false,
    configurable: true,
    writable: true,
  });
  return entitlements as EntitlementsResult;
}

/** Read `{ [key]: value }` envelopes, tolerating an already-unwrapped body. */
function unwrap<T>(res: unknown, key: string): T {
  if (res && typeof res === 'object' && !Array.isArray(res) && key in res) {
    return (res as Record<string, unknown>)[key] as T;
  }
  return res as T;
}

export class Pocketsflow {
  private apiKey: string;
  private baseUrl: string;
  private timeout: number;

  // Resource namespaces
  public products: ProductsResource;
  public variants: VariantsResource;
  public orders: OrdersResource;
  /** The payment ledger: every one-time and subscription payment. */
  public payments: PaymentsResource;
  /** Payouts, read only: status, balance and every payout with its status. */
  public payouts: PayoutsResource;
  public customers: CustomersResource;
  public reviews: ReviewsResource;
  public discounts: DiscountsResource;
  public upsells: UpsellsResource;
  public subscriptions: SubscriptionsResource;
  /** Buyers with a membership in one of your subscription offers. */
  public subscribers: SubscribersResource;
  /** Subscription offers (recurring products), distinct from buyer memberships. */
  public subscriptionOffers: SubscriptionOffersResource;
  public webhooks: WebhooksResource;
  public users: UsersResource;
  public checkout: CheckoutResource;
  public refunds: RefundsResource;
  /** Your email list: subscribers, product audiences, posts and one-off emails. */
  public newsletters: NewslettersResource;
  /** Your Link in Bio page (one per account). */
  public creatorPage: CreatorPageResource;
  /** Hosted image uploads (thumbnails, product and page images). */
  public images: ImagesResource;
  /** The partner (referral) program. */
  public partners: PartnersResource;
  /** Plans and what the account's plan unlocks. */
  public plans: PlansResource;
  /** The Monday growth report email: preview and settings. */
  public weeklyReport: WeeklyReportResource;
  /** Short links that count clicks, visitors and sales (Starter plan). */
  public trackedLinks: TrackedLinksResource;
  /** The "Powered by Pocketsflow" badge and its referral rewards. */
  public storeBadge: StoreBadgeResource;
  /** Alias of `storeBadge`. */
  public badge: StoreBadgeResource;
  /** Team members, invites, teams and the activity log (Growth plan). An API key acts as the store owner. */
  public team: TeamResource;
  /** The one-click offer after a product's checkout (Growth plan). */
  public postPurchaseOffers: PostPurchaseOffersResource;
  /** Real-purchase notices on a product's checkout (Growth plan). */
  public socialProof: SocialProofResource;
  /** Sales funnels: lead magnet + email sequence + offer (Growth plan). */
  public funnels: FunnelsResource;
  /** License keys issued with your products, and the public check endpoints. */
  public licenses: LicensesResource;
  /** The paid newsletter: membership offers that unlock paid posts (Growth plan). */
  public paidNewsletter: PaidNewsletterResource;
  /** Audience segments of your email list (Growth plan). */
  public segments: SegmentsResource;
  /** Metered usage on subscriptions with usage pricing (Pro plan). */
  public usage: UsageResource;
  /** What a product's checkout offers: payment plan, exit offer, downsell (public). */
  public checkoutOffers: CheckoutOffersResource;
  /** Flash sales (Growth plan). */
  public flashSales: FlashSalesResource;
  /** Prices by the buyer's country (Growth plan). */
  public fairPricing: FairPricingResource;
  /** Early-bird price steps and the public price quote. */
  public pricing: PricingResource;
  /** Course drip rules, quizzes and certificates (Growth plan). */
  public courses: CoursesResource;
  /** Course certificate verification (public). */
  public certificates: CertificatesResource;
  /** Analytics: advanced reports (Growth) and MRR (Pro). */
  public analytics: AnalyticsResource;
  /** Personal deadlines: per-contact countdown offers (Pro plan). */
  public personalDeadlines: PersonalDeadlinesResource;
  /** Failed payment recovery, save offers and intro pricing (Pro plan). */
  public retention: RetentionResource;
  /** Product bundles (Growth plan). */
  public bundles: BundlesResource;
  /** "Buy more, save more" cart discounts (Growth plan). */
  public tieredDiscounts: TieredDiscountsResource;
  /** Revenue splits with co-creators (Growth plan to invite). */
  public revenueSplits: RevenueSplitsResource;
  /** Embeddable email signup forms (Growth plan). */
  public signupForms: SignupFormsResource;
  /** Buyer testimonials (Growth plan). */
  public testimonials: TestimonialsResource;
  /** The "How did you hear about us?" survey (Growth plan). */
  public attributionSurvey: AttributionSurveyResource;
  /** How your store compares with similar stores (Pro plan). */
  public benchmarks: BenchmarksResource;
  /** Memberships: members-only posts and a community (Pro plan). */
  public memberships: MembershipsResource;
  /** Priority support, account manager and dispute cover. */
  public creatorServices: CreatorServicesResource;
  /** Google Sheets sync (Pro plan). */
  public sheetsSync: SheetsSyncResource;
  /** Your referral link and the stores it brought. */
  public referrals: ReferralsResource;
  /** Newsletter recommendations. */
  public recommendations: RecommendationsResource;
  /** The agency program (agency side). */
  public agency: AgencyResource;
  /** The agency that manages your store (client side). */
  public agencyAccess: AgencyAccessResource;
  /** A/B tests (Pro plan). */
  public abTests: AbTestsResource;
  /** Loyalty points and store credit (Growth plan). */
  public loyalty: LoyaltyResource;
  /** Tiered affiliate commissions and bonuses (Pro plan). */
  public affiliateTiers: AffiliateTiersResource;
  /** Imports from another platform (Volume plan). */
  public migrations: MigrationsResource;
  /** Global search (⌘K) across orders, customers, products, subscribers and discounts. */
  public search: SearchResource;
  /** Pocketsflow Penny 1, the decision model (API keys only). */
  public penny: PennyResource;

  constructor(config: PocketsflowConfig) {
    if (!config.apiKey) {
      throw new PocketsflowError('API key is required');
    }

    this.apiKey = config.apiKey;
    this.baseUrl = config.baseUrl || DEFAULT_BASE_URL;
    this.timeout = config.timeout || DEFAULT_TIMEOUT;

    // Initialize resources
    this.products = new ProductsResource(this);
    this.variants = new VariantsResource(this);
    this.orders = new OrdersResource(this);
    this.payments = new PaymentsResource(this);
    this.payouts = new PayoutsResource(this);
    this.customers = new CustomersResource(this);
    this.reviews = new ReviewsResource(this);
    this.discounts = new DiscountsResource(this);
    this.upsells = new UpsellsResource(this);
    this.subscriptions = new SubscriptionsResource(this);
    this.subscribers = new SubscribersResource(this);
    this.subscriptionOffers = new SubscriptionOffersResource(this);
    this.webhooks = new WebhooksResource(this);
    this.users = new UsersResource(this);
    this.checkout = new CheckoutResource(this);
    this.refunds = new RefundsResource(this);
    this.newsletters = new NewslettersResource(this);
    this.creatorPage = new CreatorPageResource(this);
    this.images = new ImagesResource(this);
    this.partners = new PartnersResource(this);
    this.plans = new PlansResource(this);
    this.weeklyReport = new WeeklyReportResource(this);
    this.trackedLinks = new TrackedLinksResource(this);
    this.storeBadge = new StoreBadgeResource(this);
    this.badge = this.storeBadge;
    this.team = new TeamResource(this);
    this.postPurchaseOffers = new PostPurchaseOffersResource(this);
    this.socialProof = new SocialProofResource(this);
    this.funnels = new FunnelsResource(this);
    this.licenses = new LicensesResource(this);
    this.paidNewsletter = new PaidNewsletterResource(this);
    this.segments = new SegmentsResource(this);
    this.usage = new UsageResource(this);
    this.checkoutOffers = new CheckoutOffersResource(this);
    this.flashSales = new FlashSalesResource(this);
    this.fairPricing = new FairPricingResource(this);
    this.pricing = new PricingResource(this);
    this.courses = new CoursesResource(this);
    this.certificates = new CertificatesResource(this);
    this.analytics = new AnalyticsResource(this);
    this.personalDeadlines = new PersonalDeadlinesResource(this);
    this.retention = new RetentionResource(this);
    this.bundles = new BundlesResource(this);
    this.tieredDiscounts = new TieredDiscountsResource(this);
    this.revenueSplits = new RevenueSplitsResource(this);
    this.signupForms = new SignupFormsResource(this);
    this.testimonials = new TestimonialsResource(this);
    this.attributionSurvey = new AttributionSurveyResource(this);
    this.benchmarks = new BenchmarksResource(this);
    this.memberships = new MembershipsResource(this);
    this.creatorServices = new CreatorServicesResource(this);
    this.sheetsSync = new SheetsSyncResource(this);
    this.referrals = new ReferralsResource(this);
    this.recommendations = new RecommendationsResource(this);
    this.agency = new AgencyResource(this);
    this.agencyAccess = new AgencyAccessResource(this);
    this.abTests = new AbTestsResource(this);
    this.loyalty = new LoyaltyResource(this);
    this.affiliateTiers = new AffiliateTiersResource(this);
    this.migrations = new MigrationsResource(this);
    this.search = new SearchResource(this);
    this.penny = new PennyResource(this);
  }

  async request<T>(
    method: string,
    path: string,
    options: {
      body?: any;
      params?: Record<string, any>;
      /**
       * Resolve (instead of throwing) a 4xx answer whose JSON body has a
       * boolean `valid` — the public license endpoints answer that way.
       */
      resolveValidationBody?: boolean;
      /** Extra request headers (e.g. `Idempotency-Key`). */
      headers?: Record<string, string>;
      /** `text` resolves with the raw body (CSV exports) instead of parsed JSON. */
      responseType?: 'json' | 'text';
    } = {}
  ): Promise<T> {
    const url = new URL(path, this.baseUrl);

    if (options.params) {
      Object.entries(options.params).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          url.searchParams.append(key, String(value));
        }
      });
    }

    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), this.timeout);

    // Multipart bodies (image uploads) go as-is: fetch sets the boundary.
    const isForm = typeof FormData !== 'undefined' && options.body instanceof FormData;
    const headers: Record<string, string> = { 'Authorization': `Bearer ${this.apiKey}` };
    if (!isForm) headers['Content-Type'] = 'application/json';
    if (options.headers) Object.assign(headers, options.headers);

    try {
      const response = await fetch(url.toString(), {
        method,
        headers,
        body: isForm ? options.body : options.body ? JSON.stringify(options.body) : undefined,
        signal: controller.signal,
      });

      clearTimeout(timeoutId);

      if (!response.ok) {
        let errorMessage = 'Request failed';
        let errorCode: string | undefined;
        let errorBody: Record<string, unknown> | undefined;

        try {
          const parsed: unknown = await response.json();
          if (parsed && typeof parsed === 'object' && !Array.isArray(parsed)) {
            errorBody = parsed as Record<string, unknown>;
            const { message, error, code } = errorBody;
            errorMessage =
              (typeof message === 'string' && message) ||
              (typeof error === 'string' && error) ||
              errorMessage;
            errorCode = typeof code === 'string' ? code : undefined;
          }
        } catch {
          // Ignore JSON parse errors
        }

        if (
          options.resolveValidationBody &&
          response.status >= 400 &&
          response.status < 500 &&
          errorBody &&
          typeof errorBody.valid === 'boolean'
        ) {
          return errorBody as T;
        }

        const lockCode = errorCode ?? (typeof errorBody?.error === 'string' ? errorBody.error : undefined);
        if (response.status === 403 && lockCode === 'FEATURE_LOCKED') {
          throw new FeatureLockedError(errorMessage, errorBody);
        }
        if (response.status === 403 && lockCode === 'SEAT_LIMIT') {
          throw new SeatLimitError(errorMessage, errorBody);
        }

        throw new PocketsflowError(errorMessage, errorCode, response.status, errorBody);
      }

      // Handle empty responses
      const text = await response.text();
      if (options.responseType === 'text') {
        return text as unknown as T;
      }
      if (!text) {
        return {} as T;
      }

      return JSON.parse(text) as T;
    } catch (error) {
      clearTimeout(timeoutId);

      if (error instanceof PocketsflowError) {
        throw error;
      }

      if (error instanceof Error) {
        if (error.name === 'AbortError') {
          throw new PocketsflowError('Request timeout', 'TIMEOUT');
        }
        throw new PocketsflowError(error.message);
      }

      throw new PocketsflowError('Unknown error occurred');
    }
  }
}

// ============================================================================
// Resource Classes
// ============================================================================

class ProductsResource {
  constructor(private client: Pocketsflow) {}

  /** List all products */
  async list(): Promise<Product[]> {
    return this.client.request<Product[]>('GET', '/products');
  }

  /** Get a product by ID */
  async get(id: string): Promise<Product> {
    return this.client.request<Product>('GET', `/products/${id}`);
  }

  /** Create a new product */
  async create(params: CreateProductParams): Promise<Product> {
    return this.client.request<Product>('POST', '/products', { body: params });
  }

  /** Update a product */
  async update(id: string, params: UpdateProductParams): Promise<Product> {
    return this.client.request<Product>('POST', `/products/update/${id}`, { body: params });
  }

  /** Delete a product */
  async delete(id: string): Promise<{ message: string }> {
    return this.client.request<{ message: string }>('DELETE', `/products/${id}`);
  }

  /**
   * Copy a catalog item (POC-917): duplicates one of your one-time products
   * OR a subscription offer — whichever owns the id.
   *
   * Send `{ testMode: false }` to copy a test-mode offer into live mode
   * ("Copy to live"); omit params to copy within the source's own mode.
   * The copy gets a deduplicated "Name (Copy)" name and starts unpublished
   * when copied into live mode. A copied one-time product fires the
   * `product.created` webhook against the copy's own mode.
   */
  async copy(
    id: string,
    params: CopyCatalogItemParams = {}
  ): Promise<Product | SubscriptionOffer> {
    return this.client.request<Product | SubscriptionOffer>(
      'POST',
      `/products/copy/${id}`,
      { body: params }
    );
  }

  /**
   * Turn abandoned checkout recovery on or off for a product: a buyer who
   * leaves its checkout gets one recovery email. Turning it on needs the
   * Growth plan (`FeatureLockedError` otherwise); turning it off never does.
   */
  async setAbandonedCheckout(id: string, enabled: boolean): Promise<ProductAbandonedCheckout> {
    return this.client.request<ProductAbandonedCheckout>(
      'PATCH',
      `/products/${seg(id)}/abandoned-checkout`,
      { body: { enabled } }
    );
  }

  /** A product's payment plan, exit offer and downsell settings. */
  async getCheckoutOffers(id: string): Promise<CheckoutOfferSettings> {
    return this.client.request<CheckoutOfferSettings>('GET', `/products/${seg(id)}/checkout-offers`);
  }

  /**
   * Set a product's payment plan (only the fields you send change). Turning
   * it on needs the Growth plan (`FeatureLockedError` otherwise).
   */
  async updatePaymentPlan(id: string, params: UpdatePaymentPlanParams): Promise<PaymentPlanSettings> {
    const res = await this.client.request<unknown>('PATCH', `/products/${seg(id)}/payment-plan`, {
      body: params,
    });
    return unwrap<PaymentPlanSettings>(res, 'paymentPlan');
  }

  /**
   * Set a product's exit offer and downsell. Turning either on needs the
   * Growth plan (`FeatureLockedError` otherwise).
   */
  async updateExitOffer(id: string, params: UpdateExitOfferParams): Promise<ExitOfferUpdate> {
    return this.client.request<ExitOfferUpdate>('PATCH', `/products/${seg(id)}/exit-offer`, {
      body: params,
    });
  }

  /** A product's early-bird price steps and fair pricing mode. */
  async getLaunchPricing(id: string): Promise<ProductLaunchPricing> {
    return this.client.request<ProductLaunchPricing>('GET', `/products/${seg(id)}/launch-pricing`);
  }

  /** Set a product's early-bird price steps (Growth plan to turn them on). */
  async setPriceSteps(id: string, params: SetPriceStepsParams): Promise<ProductPriceStepsUpdate> {
    return this.client.request<ProductPriceStepsUpdate>('PUT', `/products/${seg(id)}/price-steps`, {
      body: params,
    });
  }

  /** Set a product's fair pricing mode (a `custom` table needs the Growth plan). */
  async setFairPricing(id: string, params: ProductFairPricing): Promise<ProductFairPricingUpdate> {
    return this.client.request<ProductFairPricingUpdate>('PATCH', `/products/${seg(id)}/fair-pricing`, {
      body: params,
    });
  }

  /** A product's limited drop: copies for sale, sold, reserved and left. */
  async getLimitedDrop(id: string): Promise<LimitedDrop> {
    const res = await this.client.request<unknown>('GET', `/products/${seg(id)}/limited-drop`);
    return unwrap<LimitedDrop>(res, 'limitedDrop');
  }

  /** Set a product's limited drop (Starter plan to turn it on). */
  async updateLimitedDrop(id: string, params: UpdateLimitedDropParams): Promise<LimitedDrop> {
    const res = await this.client.request<unknown>('PATCH', `/products/${seg(id)}/limited-drop`, {
      body: params,
    });
    return unwrap<LimitedDrop>(res, 'limitedDrop');
  }

  /** How many copies of a drop are left. Public endpoint. */
  async getDropAvailability(id: string): Promise<LimitedDropAvailability> {
    return this.client.request<LimitedDropAvailability>('GET', `/products/${seg(id)}/drop`);
  }

  /** Whether a product's PDFs are stamped with the buyer's email. */
  async getPdfStamping(id: string): Promise<PdfStamping> {
    const res = await this.client.request<unknown>('GET', `/products/${seg(id)}/pdf-stamping`);
    return unwrap<PdfStamping>(res, 'pdfStamping');
  }

  /** Turn PDF stamping on or off (Starter plan to turn it on). */
  async updatePdfStamping(id: string, params: PdfStamping): Promise<PdfStamping> {
    const res = await this.client.request<unknown>('PATCH', `/products/${seg(id)}/pdf-stamping`, {
      body: params,
    });
    return unwrap<PdfStamping>(res, 'pdfStamping');
  }

  /** A product's download limits. */
  async getDownloadLimits(id: string): Promise<DownloadLimits> {
    const res = await this.client.request<unknown>('GET', `/products/${seg(id)}/download-limits`);
    return unwrap<DownloadLimits>(res, 'downloadLimits');
  }

  /** Set a product's download limits (Growth plan to turn them on). */
  async updateDownloadLimits(id: string, params: UpdateDownloadLimitsParams): Promise<DownloadLimits> {
    const res = await this.client.request<unknown>('PATCH', `/products/${seg(id)}/download-limits`, {
      body: params,
    });
    return unwrap<DownloadLimits>(res, 'downloadLimits');
  }
}

class VariantsResource {
  constructor(private client: Pocketsflow) {}

  /** Create a product variant */
  async create(params: CreateVariantParams): Promise<ProductVariant> {
    return this.client.request<ProductVariant>('POST', '/products/variants', { body: params });
  }

  /** Delete a product variant */
  async delete(id: string): Promise<{ message: string }> {
    return this.client.request<{ message: string }>('DELETE', `/products/variants/${id}`);
  }
}

class OrdersResource {
  constructor(private client: Pocketsflow) {}

  /**
   * List orders, newest first. Filter by `status` (paid, refunded, disputed,
   * failed) and `search` (buyer email) like the dashboard's Orders page.
   */
  async list(params: ListOrdersParams = {}): Promise<OrdersResponse> {
    const { status, ...rest } = params;
    const query = status === undefined
      ? rest
      : { ...rest, status: Array.isArray(status) ? status.join(',') : status };
    return this.client.request<OrdersResponse>('GET', '/orders', { params: query });
  }

  /**
   * The payment behind an order, live from the payment processor: card, fees,
   * tax, refunds, dispute alert, risk score, and why a declined payment failed.
   */
  async paymentDetails(id: string): Promise<OrderPaymentDetails> {
    return this.client.request<OrderPaymentDetails>(
      'GET',
      `/orders/${seg(id)}/payment-details`
    );
  }

  /** The checkout session behind an order: attempts, declines, authorization rate. */
  async journey(id: string): Promise<OrderJourney> {
    return this.client.request<OrderJourney>('GET', `/orders/${seg(id)}/journey`);
  }

  /**
   * Get an order by ID: the sale (with its fee breakdown) plus its product,
   * customer, review and upsells.
   */
  async get(id: string): Promise<OrderDetail> {
    return this.client.request<OrderDetail>('GET', `/orders/${id}`);
  }

  /** An order's downloads: used and left per file, expiry and stamping. */
  async getDownloads(id: string): Promise<OrderDownloads> {
    const res = await this.client.request<unknown>('GET', `/orders/${seg(id)}/downloads`);
    return unwrap<OrderDownloads>(res, 'downloads');
  }

  /** Give the buyer their downloads back (and restart the expiry). */
  async resetDownloads(id: string): Promise<OrderDownloads> {
    const res = await this.client.request<unknown>('POST', `/orders/${seg(id)}/downloads/reset`);
    return unwrap<OrderDownloads>(res, 'downloads');
  }
}

/**
 * Your payouts, read only: whether payouts are active, the balance, and every
 * payout with its status. Withdrawing money stays in the dashboard.
 */
class PayoutsResource {
  constructor(private client: Pocketsflow) {}

  /**
   * Whether payouts are active, and if not why and what (if anything) to do:
   * identity verification, an information request, a review or a hold.
   */
  async status(): Promise<PayoutStatus> {
    return this.client.request<PayoutStatus>('GET', '/payouts/status');
  }

  /** The balance: available to withdraw and still pending, in the account currency. */
  async balance(): Promise<PayoutBalance> {
    return this.client.request<PayoutBalance>('GET', '/payouts/balances');
  }

  /** Payouts (withdrawals), newest first, with status, fees and net amount. */
  async list(params: ListPayoutsParams = {}): Promise<PayoutsResponse> {
    return this.client.request<PayoutsResponse>('GET', '/payouts', { params });
  }

  /** One payout with its current status. */
  async get(id: string): Promise<Payout> {
    return this.client.request<Payout>('GET', `/payouts/${seg(id)}`);
  }
}

/** The payment ledger: one-time purchases and subscription charges. */
class PaymentsResource {
  constructor(private client: Pocketsflow) {}

  /**
   * List payments, newest first: one-time purchases AND subscription payments
   * (the initial charge plus every renewal). Paginated: `pageSize` is at most 100.
   */
  async list(params: ListPaymentsParams = {}): Promise<PaymentsResponse> {
    return this.client.request<PaymentsResponse>('GET', '/payments', { params });
  }

  /**
   * Get one payment with its product or subscription offer and customer.
   * Pass `{ live: true }` to also fetch the live payment from the payments partner.
   */
  async get(id: string, params: GetPaymentParams = {}): Promise<PaymentDetail> {
    return this.client.request<PaymentDetail>('GET', `/payments/${seg(id)}`, { params });
  }
}

class CustomersResource {
  constructor(private client: Pocketsflow) {}

  /** List all customers, each with every product they bought (`products`) */
  async list(params: ListCustomersParams = {}): Promise<Customer[]> {
    return this.client.request<Customer[]>('GET', '/customers', { params });
  }

  /** Get a customer with their stats, orders, subscriptions and reviews */
  async get(id: string): Promise<CustomerDetail> {
    return this.client.request<CustomerDetail>('GET', `/customers/${id}`);
  }

  /** Your best customers by lifetime value, orders or last purchase (Pro plan). */
  async listProfiles(params: ListCustomerProfilesParams = {}): Promise<CustomerProfilesPage> {
    return this.client.request<CustomerProfilesPage>('GET', '/customers/profiles', { params });
  }

  /** Every CRM tag in use (Pro plan). */
  async listTags(): Promise<string[]> {
    const res = await this.client.request<unknown>('GET', '/customers/profiles/tags');
    return unwrap<string[]>(res, 'tags');
  }

  /**
   * A customer's profile: lifetime value, products, subscriptions, email
   * engagement, segments, tags, notes and timeline (Pro plan). `id` is a
   * customer id or a profile id.
   */
  async getProfile(id: string): Promise<CustomerProfile> {
    return this.client.request<CustomerProfile>('GET', `/customers/${seg(id)}/profile`);
  }

  /** A customer's notes, newest first (Pro plan). */
  async listNotes(id: string): Promise<CustomerNote[]> {
    const res = await this.client.request<unknown>('GET', `/customers/${seg(id)}/notes`);
    return unwrap<CustomerNote[]>(res, 'data');
  }

  /** Add a note to a customer (at most 2,000 characters; Pro plan). */
  async addNote(id: string, params: { body: string }): Promise<CustomerNote> {
    return this.client.request<CustomerNote>('POST', `/customers/${seg(id)}/notes`, { body: params });
  }

  /** Delete a customer note. */
  async deleteNote(id: string, noteId: string): Promise<DeletedResult> {
    return this.client.request<DeletedResult>(
      'DELETE',
      `/customers/${seg(id)}/notes/${seg(noteId)}`
    );
  }

  /** Replace a customer's CRM tags (at most 20, lower-cased; Pro plan). */
  async setTags(id: string, params: { tags: string[] }): Promise<string[]> {
    const res = await this.client.request<unknown>('PUT', `/customers/${seg(id)}/tags`, {
      body: params,
    });
    return unwrap<string[]>(res, 'tags');
  }
}

class ReviewsResource {
  constructor(private client: Pocketsflow) {}

  /** List all reviews */
  async list(params: ListReviewsParams = {}): Promise<Review[]> {
    return this.client.request<Review[]>('GET', '/reviews', { params });
  }
}

class DiscountsResource {
  constructor(private client: Pocketsflow) {}

  /** List all discounts */
  async list(): Promise<Discount[]> {
    return this.client.request<Discount[]>('GET', '/discounts');
  }

  /** Get a discount by ID */
  async get(id: string): Promise<Discount> {
    return this.client.request<Discount>('GET', `/discounts/${id}`);
  }

  /** Create a new discount */
  async create(params: CreateDiscountParams): Promise<Discount> {
    return this.client.request<Discount>('POST', '/discounts', { body: params });
  }

  /** Update a discount */
  async update(id: string, params: UpdateDiscountParams): Promise<Discount> {
    return this.client.request<Discount>('POST', `/discounts/${id}`, { body: params });
  }

  /** Delete a discount */
  async delete(id: string): Promise<{ message: string }> {
    return this.client.request<{ message: string }>('DELETE', `/discounts/${id}`);
  }

  /**
   * Look up a discount code as a buyer would at checkout: resolves to the
   * discount when `code` is active and applies to `productId` (a product or
   * subscription offer). Throws a 404 `PocketsflowError` otherwise. Public
   * endpoint: it does not need your API key.
   */
  async apply(
    code: string,
    productId: string,
    options: ApplyDiscountOptions = {}
  ): Promise<AppliedDiscount> {
    return this.client.request<AppliedDiscount>(
      'GET',
      `/discounts/apply/${seg(code)}/${seg(productId)}`,
      { params: options }
    );
  }

  /** A discount's one-time codes with their stats, newest first. */
  async listUniqueCodes(id: string, params: ListUniqueCodesParams = {}): Promise<UniqueCodesResponse> {
    return this.client.request<UniqueCodesResponse>('GET', `/discounts/${seg(id)}/unique-codes`, {
      params,
    });
  }

  /**
   * Issue one-time codes for a list of `emails` or `count` bearer codes (at
   * most 5,000). The discount needs `uniquePerRecipient` (Growth plan).
   */
  async createUniqueCodes(id: string, params: CreateUniqueCodesParams): Promise<CreatedUniqueCodes> {
    return this.client.request<CreatedUniqueCodes>('POST', `/discounts/${seg(id)}/unique-codes`, {
      body: params,
    });
  }

  /** A discount's one-time codes as CSV text. */
  async exportUniqueCodes(id: string, params: ExportUniqueCodesParams = {}): Promise<string> {
    return this.client.request<string>('GET', `/discounts/${seg(id)}/unique-codes/export`, {
      params,
      responseType: 'text',
    });
  }

  /**
   * Whether any active discount applies to this product or subscription
   * offer (e.g. to show a "Have a code?" field). Public endpoint.
   */
  async checkProduct(productId: string): Promise<boolean> {
    return this.client.request<boolean>('GET', `/discounts/check-product/${seg(productId)}`);
  }
}

class UpsellsResource {
  constructor(private client: Pocketsflow) {}

  /** List all upsells */
  async list(): Promise<UpsellsResponse> {
    return this.client.request<UpsellsResponse>('GET', '/upsells');
  }

  /** Get an upsell by ID */
  async get(id: string): Promise<Upsell> {
    return this.client.request<Upsell>('GET', `/upsells/${id}`);
  }

  /** Create a new upsell */
  async create(params: CreateUpsellParams): Promise<Upsell> {
    return this.client.request<Upsell>('POST', '/upsells', { body: params });
  }

  /** Update an upsell */
  async update(id: string, params: UpdateUpsellParams): Promise<Upsell> {
    return this.client.request<Upsell>('POST', `/upsells/${id}`, { body: params });
  }

  /** Delete an upsell */
  async delete(id: string): Promise<{ message: string }> {
    return this.client.request<{ message: string }>('DELETE', `/upsells/${id}`);
  }
}

class SubscriptionsResource {
  constructor(private client: Pocketsflow) {}

  /**
   * List subscription customers (legacy `POST /orders/subscriptions`).
   * @deprecated Use `subscribers.list()`, the documented subscriber list.
   */
  async list(params: ListSubscriptionsParams = {}): Promise<any> {
    return this.client.request<any>('POST', '/orders/subscriptions', { body: params });
  }

  /**
   * Get a subscriber with its offer, customer record and payment history
   * (`GET /orders/subscriptions/{id}`). `subscribers.get()` returns the same
   * data with the subscriber under `subscriber`.
   */
  async get(id: string): Promise<SubscriberOrderHistory> {
    return this.client.request<SubscriberOrderHistory>(
      'GET',
      `/orders/subscriptions/${seg(id)}`
    );
  }

  /**
   * Cancel a legacy card subscription immediately, by its `sub_…` id.
   * @deprecated This route is no longer served by the API (it answers 404).
   * Use `subscribers.cancel()` with the subscriber `_id` or `mem_…` id.
   */
  async cancel(stripeSubscriptionId: string): Promise<{ message: string }> {
    return this.client.request<{ message: string }>(
      'POST',
      `/orders/subscriptions/cancel/${stripeSubscriptionId}`
    );
  }

  /**
   * Refund a legacy card subscription, by its `sub_…` id.
   * @deprecated This route is no longer served by the API (it answers 404).
   * Refund payments from the dashboard.
   */
  async refund(stripeSubscriptionId: string): Promise<{ message: string }> {
    return this.client.request<{ message: string }>(
      'POST',
      `/orders/subscriptions/refund/${stripeSubscriptionId}`
    );
  }

  /**
   * Change a subscriber's seat count (per-seat offers, Pro plan).
   * `subscriberId` is the subscriber `_id` or its `mem_…` id.
   */
  async updateSeats(subscriberId: string, params: UpdateSeatsParams): Promise<UpdateSeatsResponse> {
    return this.client.request<UpdateSeatsResponse>(
      'POST',
      `/subscriptions/${seg(subscriberId)}/seats`,
      { body: params }
    );
  }

  /** Set the seats and meters of a subscription offer (Pro plan). */
  async updateUsagePricing(offerId: string, params: UsagePricing): Promise<UpdateUsagePricingResponse> {
    return this.client.request<UpdateUsagePricingResponse>(
      'PUT',
      `/subscriptions/${seg(offerId)}/usage-pricing`,
      { body: params }
    );
  }
}

/** Buyers with a membership in one of your subscription offers. */
class SubscribersResource {
  constructor(private client: Pocketsflow) {}

  /**
   * List subscribers, newest first, with their live `status`, `portalUrl` and
   * the joined subscription offer. Paginated: `pageSize` is at most 100.
   */
  async list(params: ListSubscribersParams = {}): Promise<SubscribersResponse> {
    return this.client.request<SubscribersResponse>('GET', '/subscriptions/subscribers', {
      params,
    });
  }

  /**
   * Get a subscriber with its offer, customer record and full payment history.
   * Pass `{ live: true }` to also fetch the live membership from the payments partner.
   */
  async get(id: string, params: GetSubscriberParams = {}): Promise<SubscriberDetail> {
    return this.client.request<SubscriberDetail>(
      'GET',
      `/subscriptions/subscribers/${seg(id)}`,
      { params }
    );
  }

  /**
   * Cancel a membership at the end of the current billing period (access
   * continues until then). `id` is the subscriber `_id` or a membership id
   * (`mem_…`) — not a `sub_…` id.
   */
  async cancel(id: string): Promise<MembershipActionResult> {
    return this.client.request<MembershipActionResult>(
      'POST',
      `/subscriptions/${seg(id)}/cancel`
    );
  }

  /**
   * Pause payment collection on a membership. The buyer keeps access and is
   * not charged until `resume()`. `id` is the subscriber `_id` or `mem_…` id.
   */
  async pause(id: string): Promise<MembershipActionResult> {
    return this.client.request<MembershipActionResult>(
      'POST',
      `/subscriptions/${seg(id)}/pause`
    );
  }

  /**
   * Resume a paused membership, or undo a pending cancel-at-period-end.
   * `id` is the subscriber `_id` or `mem_…` id.
   */
  async resume(id: string): Promise<MembershipActionResult> {
    return this.client.request<MembershipActionResult>(
      'POST',
      `/subscriptions/${seg(id)}/resume`
    );
  }
}

/** Your subscription offers — the recurring products you sell. */
class SubscriptionOffersResource {
  constructor(private client: Pocketsflow) {}

  /** List all subscription offers */
  async list(): Promise<SubscriptionOffer[]> {
    return this.client.request<SubscriptionOffer[]>('GET', '/subscriptions');
  }

  /** Get a subscription offer by ID */
  async get(id: string): Promise<SubscriptionOffer> {
    return this.client.request<SubscriptionOffer>('GET', `/subscriptions/${id}`);
  }

  /** Create a subscription offer */
  async create(params: CreateSubscriptionOfferParams): Promise<SubscriptionOffer> {
    return this.client.request<SubscriptionOffer>('POST', '/subscriptions', { body: params });
  }

  /**
   * Delete a subscription offer. Existing subscribers keep their memberships;
   * manage them with `subscribers.*`.
   */
  async delete(id: string): Promise<DeletedSubscriptionOffer> {
    return this.client.request<DeletedSubscriptionOffer>('DELETE', `/subscriptions/${seg(id)}`);
  }
}

/** The webhook delivery log (entries are kept for 30 days). */
class WebhookDeliveriesResource {
  constructor(private client: Pocketsflow) {}

  /**
   * List delivery attempts in the key's mode (including tests and
   * redeliveries), newest first. Paginated: `pageSize` is at most 100.
   */
  async list(params: ListWebhookDeliveriesParams = {}): Promise<WebhookDeliveriesResponse> {
    return this.client.request<WebhookDeliveriesResponse>('GET', '/delivered-webhooks', {
      params,
    });
  }

  /** Get one delivery, including the exact body that was sent (`webhookData`). */
  async get(id: string): Promise<WebhookDelivery> {
    const res = await this.client.request<unknown>('GET', `/delivered-webhooks/${seg(id)}`);
    return unwrap<WebhookDelivery>(res, 'deliveredWebhook');
  }

  /**
   * Send a logged delivery's body to its endpoint again (same event id,
   * freshly signed). Resolves even when your endpoint fails — check `delivered`.
   */
  async redeliver(id: string): Promise<WebhookRedeliveryResult> {
    return this.client.request<WebhookRedeliveryResult>(
      'POST',
      `/delivered-webhooks/${seg(id)}/redeliver`
    );
  }
}

class WebhooksResource {
  /** The delivery log: list, inspect and replay deliveries. */
  public deliveries: WebhookDeliveriesResource;

  constructor(private client: Pocketsflow) {
    this.deliveries = new WebhookDeliveriesResource(client);
  }

  /** List your webhook endpoints in the key's mode, newest first (without secrets). */
  async list(): Promise<Webhook[]> {
    const res = await this.client.request<unknown>('GET', '/webhooks');
    return unwrap<Webhook[]>(res, 'webhooks');
  }

  /** Get a webhook endpoint by ID, including its signing `secret`. */
  async get(id: string): Promise<Webhook> {
    const res = await this.client.request<unknown>('GET', `/webhooks/${seg(id)}`);
    return unwrap<Webhook>(res, 'webhook');
  }

  /**
   * Register an endpoint for the selected events (in the key's mode). The
   * response carries the signing `secret` — store it to verify deliveries.
   */
  async create(params: CreateWebhookParams): Promise<CreatedWebhook> {
    return this.client.request<CreatedWebhook>('POST', '/webhooks', { body: params });
  }

  /**
   * Update an endpoint's `url`, `events`, `description` or `active` flag
   * (`PATCH /webhooks/{id}`). Only the fields you send change. The returned
   * webhook does not include the `secret`.
   */
  async update(id: string, params: UpdateWebhookParams): Promise<Webhook> {
    const res = await this.client.request<unknown>('PATCH', `/webhooks/${seg(id)}`, {
      body: params,
    });
    return unwrap<Webhook>(res, 'webhook');
  }

  /** Delete a webhook endpoint */
  async delete(id: string): Promise<{ message: string }> {
    return this.client.request<{ message: string }>('DELETE', `/webhooks/${seg(id)}`);
  }

  /**
   * Replace the endpoint's signing secret and return the new one. Deliveries
   * are signed with the new secret immediately — update your verifier first.
   */
  async rotateSecret(id: string): Promise<WebhookSecretRotation> {
    return this.client.request<WebhookSecretRotation>(
      'POST',
      `/webhooks/${seg(id)}/rotate-secret`
    );
  }

  /**
   * Send a sample event to this endpoint only and return the outcome. The
   * attempt is recorded in the delivery log. Resolves even when your endpoint
   * fails — check `delivered`.
   */
  async test(id: string): Promise<WebhookTestResult> {
    return this.client.request<WebhookTestResult>('POST', `/webhooks/${seg(id)}/test`);
  }
}

class UsersResource {
  constructor(private client: Pocketsflow) {}

  /** Get current user information */
  async me(): Promise<User> {
    return this.client.request<User>('GET', '/users/me');
  }

  /** Update current user */
  async update(params: UpdateUserParams): Promise<User> {
    return this.client.request<User>('POST', '/users/update', { body: params });
  }

  /**
   * What the account's active plan unlocks: plan, fee rate, seats and one
   * entry per feature. Same call as `plans.entitlements()`.
   */
  async entitlements(): Promise<EntitlementsResult> {
    return withCan(await this.client.request<Entitlements>('GET', '/users/entitlements'));
  }

  /**
   * Record what the creator sells and where their buyers pay (`'pages'` or
   * `'code'`), the answers `me()` returns. Send only what changes; `null`
   * clears one. An unknown value is a 400.
   */
  async updateSellingProfile(params: UpdateSellingProfileParams): Promise<SellingProfile> {
    return this.client.request<SellingProfile>('PUT', '/users/selling-profile', { body: params });
  }

  /**
   * Set or remove ad-platform pixel ids (`''` or `null` removes one).
   * Adding or changing a pixel needs the Starter plan (`FeatureLockedError`
   * otherwise); a malformed id is a 400 whose `body.field` names the field.
   */
  async updateTrackingPixels(params: UpdateTrackingPixelsParams): Promise<User> {
    return this.client.request<User>('POST', '/users/update', { body: params });
  }
}

class CheckoutResource {
  constructor(private client: Pocketsflow) {}

  /** Create a checkout session */
  async create(params: CreateCheckoutParams): Promise<CheckoutSession> {
    return this.client.request<CheckoutSession>('POST', '/checkout/sessions', { body: params });
  }

  /**
   * Live checkouts buyers left without paying in the last 30 days, whatever
   * the key's mode. Available on every plan.
   */
  async abandonedSummary(): Promise<AbandonedCheckoutSummary> {
    return this.client.request<AbandonedCheckoutSummary>('GET', '/checkout/abandoned/summary');
  }
}

/**
 * Refund policies: the refund terms shown on your products' checkout and
 * product pages. (Refunding a payment is done from the dashboard.)
 */
class RefundsResource {
  constructor(private client: Pocketsflow) {}

  /** List your refund policies, with how many products use each (`appliedTo`) */
  async list(): Promise<RefundPolicy[]> {
    return this.client.request<RefundPolicy[]>('GET', '/refunds');
  }

  /** Get a refund policy by ID */
  async get(id: string): Promise<RefundPolicy> {
    return this.client.request<RefundPolicy>('GET', `/refunds/${id}`);
  }

  /** Create a refund policy */
  async create(params: CreateRefundPolicyParams): Promise<RefundPolicy> {
    return this.client.request<RefundPolicy>('POST', '/refunds', { body: params });
  }

  /** Update a refund policy (only the fields you send change) */
  async update(id: string, params: UpdateRefundPolicyParams): Promise<RefundPolicy> {
    return this.client.request<RefundPolicy>('POST', `/refunds/${seg(id)}`, { body: params });
  }

  /** Delete a refund policy; resolves to the deleted policy */
  async delete(id: string): Promise<RefundPolicy> {
    return this.client.request<RefundPolicy>('DELETE', `/refunds/${seg(id)}`);
  }
}

class NewsletterSubscribersResource {
  constructor(private client: Pocketsflow) {}

  /** List your email subscribers, optionally only one product audience */
  async list(params: ListEmailSubscribersParams = {}): Promise<EmailSubscriber[]> {
    return this.client.request<EmailSubscriber[]>('GET', '/newsletters/subscribers', {
      params,
    });
  }

  /** Get an email subscriber by ID */
  async get(id: string): Promise<EmailSubscriber> {
    return this.client.request<EmailSubscriber>('GET', `/newsletters/subscribers/${id}`);
  }

  /** Remove a contact from your email list; resolves to the removed subscriber */
  async delete(id: string): Promise<EmailSubscriber> {
    return this.client.request<EmailSubscriber>(
      'DELETE',
      `/newsletters/subscribers/${seg(id)}`
    );
  }
}

class AudiencesResource {
  constructor(private client: Pocketsflow) {}

  /** List your product audiences: one per product or subscription you sell */
  async list(): Promise<ProductAudience[]> {
    return this.client.request<ProductAudience[]>('GET', '/newsletters/audiences');
  }

  /**
   * Add a product's buyers to your email list (or every buyer, without a
   * productId). Throws a 403 `PocketsflowError` when it would exceed your
   * plan's subscriber limit.
   */
  async sync(params: SyncAudienceParams = {}): Promise<AudienceSyncResult> {
    return this.client.request<AudienceSyncResult>('POST', '/newsletters/audiences/sync', {
      body: params,
    });
  }
}

/** Newsletter posts: email campaigns to your list. */
class PostsResource {
  constructor(private client: Pocketsflow) {}

  /** List your posts, optionally only one `status` */
  async list(params: ListPostsParams = {}): Promise<Post[]> {
    return this.client.request<Post[]>('GET', '/newsletters/posts', { params });
  }

  /** Get a post by ID */
  async get(id: string): Promise<Post> {
    return this.client.request<Post>('GET', `/newsletters/posts/${seg(id)}`);
  }

  /**
   * Create a post (a draft by default). Pick recipients with `sendToAll`,
   * `productIds` (product audiences), `subscriberIds` or `tags`.
   */
  async create(params: CreatePostParams): Promise<Post> {
    return this.client.request<Post>('POST', '/newsletters/posts', { body: params });
  }

  /** Update a post (only the fields you send change) */
  async update(id: string, params: UpdatePostParams): Promise<Post> {
    return this.client.request<Post>('POST', `/newsletters/posts/${seg(id)}`, {
      body: params,
    });
  }

  /** Delete a post; resolves to the deleted post */
  async delete(id: string): Promise<Post> {
    return this.client.request<Post>('DELETE', `/newsletters/posts/${seg(id)}`);
  }

  /** Queue a post for sending now to its recipients */
  async send(id: string): Promise<SendPostResult> {
    return this.client.request<SendPostResult>('POST', `/newsletters/posts/${seg(id)}/send`);
  }

  /**
   * Choose who gets a post: `everyone`, `free` or `paid` subscribers.
   * `free` / `paid` need the paid newsletter (Growth plan).
   */
  async setAudience(id: string, params: SetPostAudienceParams): Promise<Post> {
    return this.client.request<Post>('POST', `/newsletters/posts/${seg(id)}/audience`, {
      body: params,
    });
  }

  /** A sent post's non-openers and its resend, if any. */
  async getResend(id: string): Promise<PostResend> {
    return this.client.request<PostResend>('GET', `/newsletters/posts/${seg(id)}/resend`);
  }

  /** Resend a sent post to its non-openers with a new subject (Growth plan). */
  async resendToNonOpeners(id: string, params: ResendToNonOpenersParams): Promise<PostResend> {
    return this.client.request<PostResend>('POST', `/newsletters/posts/${seg(id)}/resend`, {
      body: params,
    });
  }

  /** Cancel a scheduled resend. */
  async cancelResend(id: string): Promise<PostResend> {
    return this.client.request<PostResend>('DELETE', `/newsletters/posts/${seg(id)}/resend`);
  }

  /** A post's subject line test: both arms and the rest of the audience. */
  async getSubjectTest(id: string): Promise<SubjectTest> {
    return this.client.request<SubjectTest>('GET', `/newsletters/posts/${seg(id)}/subject-test`);
  }

  /**
   * Send a draft with a subject test: two subjects go to a slice of the
   * audience, the winner (most opens) to the rest (Growth plan).
   */
  async startSubjectTest(id: string, params: StartSubjectTestParams): Promise<SubjectTest> {
    return this.client.request<SubjectTest>('POST', `/newsletters/posts/${seg(id)}/subject-test`, {
      body: params,
    });
  }
}

/** Your email list: subscribers, product audiences, posts and one-off emails. */
class NewslettersResource {
  public subscribers: NewsletterSubscribersResource;
  public audiences: AudiencesResource;
  public posts: PostsResource;

  constructor(private client: Pocketsflow) {
    this.subscribers = new NewsletterSubscribersResource(client);
    this.audiences = new AudiencesResource(client);
    this.posts = new PostsResource(client);
  }

  /**
   * Send a one-off email (e.g. a transactional message) to 1 – 100
   * recipients. Unsubscribed recipients are skipped — check `skipped`.
   */
  async send(params: SendEmailParams): Promise<SendEmailResult> {
    return this.client.request<SendEmailResult>('POST', '/newsletters/send', { body: params });
  }
}

/** Your Link in Bio page (one per account). */
class CreatorPageResource {
  constructor(private client: Pocketsflow) {}

  /** Get your page */
  async get(): Promise<CreatorPage> {
    return this.client.request<CreatorPage>('GET', '/creator-pages');
  }

  /** Create your page (one per account) */
  async create(params: CreateCreatorPageParams): Promise<CreatorPage> {
    return this.client.request<CreatorPage>('POST', '/creator-pages', { body: params });
  }

  /** Update your page (`PUT`; only the fields you send change) */
  async update(params: UpdateCreatorPageParams): Promise<CreatorPage> {
    return this.client.request<CreatorPage>('PUT', '/creator-pages', { body: params });
  }

  /** Delete your page */
  async delete(): Promise<{ message: string }> {
    return this.client.request<{ message: string }>('DELETE', '/creator-pages');
  }

  /** Change only your page's username (3 – 30 letters, numbers, `_` or `-`) */
  async updateUsername(username: string): Promise<CreatorPageUsernameUpdate> {
    return this.client.request<CreatorPageUsernameUpdate>('PATCH', '/creator-pages/username', {
      body: { username },
    });
  }

  /**
   * Check whether a username is free. Resolves when it is available; throws
   * a 400 `PocketsflowError` when it is taken or malformed.
   */
  async checkUsername(username: string): Promise<{ message: string }> {
    return this.client.request<{ message: string }>(
      'GET',
      `/creator-pages/check-username/${seg(username)}`
    );
  }
}

/** Hosted image uploads. */
class ImagesResource {
  constructor(private client: Pocketsflow) {}

  /**
   * Upload an image (multipart field `image`) and get its hosted URL — use it
   * as a product `thumbnail`, in `images`, or on your creator page. PNG,
   * JPEG, WebP, GIF and AVIF are accepted. Needs a runtime with global
   * `FormData` and `Blob` (Node 18+).
   */
  async upload(image: ImageUploadInput, options: UploadImageOptions = {}): Promise<UploadedImage> {
    const blob =
      image instanceof Blob
        ? image
        : new Blob([image as ArrayBuffer], options.contentType ? { type: options.contentType } : {});
    const form = new FormData();
    form.append('image', blob, options.filename || 'image');
    return this.client.request<UploadedImage>('POST', '/images', { body: form });
  }
}

/** The partner (referral) program. */
class PartnersResource {
  constructor(private client: Pocketsflow) {}

  /**
   * Join the partner program. Needs a connected payout account (403
   * otherwise); throws 409 if you are already a partner.
   */
  async create(): Promise<Partner> {
    return this.client.request<Partner>('POST', '/partners');
  }

  /** Get your partner profile (404 if you are not a partner) */
  async get(): Promise<Partner> {
    return this.client.request<Partner>('GET', '/partners');
  }

  /**
   * Attribute your account to a partner's referral code. Only within the
   * first days after signing up, and only once.
   */
  async registerReferral(referralCode: string): Promise<ReferralRegistration> {
    return this.client.request<ReferralRegistration>('POST', '/partners/register-referral', {
      body: { referralCode },
    });
  }

  /** Sellers who signed up with your code, newest first. `limit` is at most 100. */
  async listReferrals(params: PartnerListParams = {}): Promise<PartnerListResponse<ReferredUser>> {
    return this.client.request<PartnerListResponse<ReferredUser>>('GET', '/partners/referrals', {
      params,
    });
  }

  /** Sales made by the sellers you referred, with your commission on each. */
  async listReferralSales(
    params: PartnerListParams = {}
  ): Promise<PartnerListResponse<ReferralSale>> {
    return this.client.request<PartnerListResponse<ReferralSale>>(
      'GET',
      '/partners/referrals/sales',
      { params }
    );
  }

  /** Your partner totals: signups, sales, revenue and commission */
  async stats(): Promise<PartnerStats> {
    return this.client.request<PartnerStats>('GET', '/partners/stats');
  }
}

/** Plans and what the account's plan unlocks. */
class PlansResource {
  constructor(private client: Pocketsflow) {}

  /**
   * What the account's active plan unlocks: plan, fee rate, seats and one
   * entry per feature. The result has a `can(featureKey)` helper.
   */
  async entitlements(): Promise<EntitlementsResult> {
    return withCan(await this.client.request<Entitlements>('GET', '/users/entitlements'));
  }

  /** Every self-serve plan with its prices, limits and features. Public endpoint. */
  async list(): Promise<Plan[]> {
    const res = await this.client.request<unknown>('GET', '/users/billing-tiers');
    return unwrap<Plan[]>(res, 'tiers');
  }
}

/** The Monday growth report email (free on every plan). */
class WeeklyReportResource {
  constructor(private client: Pocketsflow) {}

  /** Build last week's report now: the email (`subject`, `html`, `text`) and its numbers. */
  async get(): Promise<WeeklyReportPreview> {
    return this.client.request<WeeklyReportPreview>('GET', '/users/weekly-report/preview');
  }

  /** Whether the Monday email is on, its time zone and the next send. */
  async getSettings(): Promise<WeeklyReportSettings> {
    return this.client.request<WeeklyReportSettings>('GET', '/users/weekly-report/settings');
  }

  /** Turn the Monday email on or off. */
  async updateSettings(params: UpdateWeeklyReportSettingsParams): Promise<WeeklyReportSettings> {
    return this.client.request<WeeklyReportSettings>('PUT', '/users/weekly-report/settings', {
      body: params,
    });
  }
}

/**
 * Tracked links: short links on your store that count clicks, visitors and
 * sales. Creating and editing need the Starter plan; reads work on every
 * plan but carry no stats (`statsLocked: true`) below it.
 */
class TrackedLinksResource {
  constructor(private client: Pocketsflow) {}

  /** Your links (newest first) with their stats, totals, channels and daily rows. */
  async list(params: ListTrackedLinksParams = {}): Promise<TrackedLinkListResponse> {
    const { archived, ...range } = params;
    return this.client.request<TrackedLinkListResponse>('GET', '/tracked-links', {
      params: { ...range, archived: archived ? '1' : undefined },
    });
  }

  /**
   * Create a link. A taken slug is a 409 whose `body.suggestion` is a free
   * one; below Starter it throws `FeatureLockedError`.
   */
  async create(params: CreateTrackedLinkParams): Promise<TrackedLink> {
    const res = await this.client.request<unknown>('POST', '/tracked-links', { body: params });
    return unwrap<TrackedLink>(res, 'link');
  }

  /** One link with its stats, daily rows and top countries. */
  async get(id: string, params: TrackedLinkStatsParams = {}): Promise<TrackedLinkStatsResponse> {
    return this.client.request<TrackedLinkStatsResponse>('GET', `/tracked-links/${seg(id)}`, {
      params,
    });
  }

  /**
   * Edit or archive a link (only the fields you send change). The slug
   * never changes. Archiving is free; other edits need the Starter plan.
   */
  async update(id: string, params: UpdateTrackedLinkParams): Promise<TrackedLink> {
    const res = await this.client.request<unknown>('PATCH', `/tracked-links/${seg(id)}`, {
      body: params,
    });
    return unwrap<TrackedLink>(res, 'link');
  }

  /** Whether a slug is valid and free. `excludeId` ignores one of your links. */
  async checkSlug(slug: string, excludeId?: string): Promise<TrackedLinkSlugCheck> {
    return this.client.request<TrackedLinkSlugCheck>('GET', '/tracked-links/slug-available', {
      params: { slug, excludeId },
    });
  }
}

/** The "Powered by Pocketsflow" badge on your store, and its referral rewards. */
class StoreBadgeResource {
  constructor(private client: Pocketsflow) {}

  /** Whether the badge shows, whether your plan may hide it, and its referral stats. */
  async get(): Promise<StoreBadge> {
    return this.client.request<StoreBadge>('GET', '/powered-by/me');
  }

  /**
   * Show or hide the badge. Hiding it (`showPoweredBy: false`) needs the
   * Starter plan (`FeatureLockedError` otherwise); showing it is always allowed.
   */
  async update(params: UpdateStoreBadgeParams): Promise<StoreBadge> {
    return this.client.request<StoreBadge>('PUT', '/powered-by', { body: params });
  }

  /**
   * The badge's referral numbers: code, link, clicks, signups and free
   * months earned (same call as `get()`, referral fields only).
   */
  async referralStats(): Promise<StoreBadgeReferralStats> {
    const { code, link, clicks, signups, clearing, freeMonths } = await this.get();
    return { code, link, clicks, signups, clearing, freeMonths };
  }
}

/** Pending invitations to your store. */
class TeamInvitesResource {
  constructor(private client: Pocketsflow) {}

  /**
   * Invite someone by email (Growth plan). Throws `SeatLimitError` when
   * every seat is taken, `FeatureLockedError` below Growth.
   */
  async create(params: InviteTeamMemberParams): Promise<TeamInviteCreated> {
    return this.client.request<TeamInviteCreated>('POST', '/team/invites', { body: params });
  }

  /** Send the invitation email again; the invite is valid 7 more days. */
  async resend(id: string): Promise<TeamInviteResent> {
    return this.client.request<TeamInviteResent>('POST', `/team/invites/${seg(id)}/resend`);
  }

  /** Cancel a pending invitation. */
  async cancel(id: string): Promise<TeamOk> {
    return this.client.request<TeamOk>('DELETE', `/team/invites/${seg(id)}`);
  }
}

/** People with access to your store. */
class TeamMembersResource {
  constructor(private client: Pocketsflow) {}

  /** Change a member's role, teams or status (`paused` keeps them out). */
  async update(id: string, params: UpdateTeamMemberParams): Promise<TeamMemberUpdate> {
    return this.client.request<TeamMemberUpdate>('PATCH', `/team/members/${seg(id)}`, {
      body: params,
    });
  }

  /** Remove a member from your store. */
  async remove(id: string): Promise<TeamOk> {
    return this.client.request<TeamOk>('DELETE', `/team/members/${seg(id)}`);
  }
}

/** Teams: named groups of members with access to some dashboard areas. */
class TeamTeamsResource {
  constructor(private client: Pocketsflow) {}

  /** Create a team (Growth plan). */
  async create(params: CreateTeamParams): Promise<TeamRecord> {
    return this.client.request<TeamRecord>('POST', '/team/teams', { body: params });
  }

  /** Rename a team or change its areas (Growth plan). */
  async update(id: string, params: UpdateTeamParams): Promise<TeamRecord> {
    return this.client.request<TeamRecord>('PATCH', `/team/teams/${seg(id)}`, { body: params });
  }

  /** Delete a team (its members stay on the store). */
  async delete(id: string): Promise<TeamOk> {
    return this.client.request<TeamOk>('DELETE', `/team/teams/${seg(id)}`);
  }
}

/** Your store's team (Growth plan). An API key acts as the store owner. */
class TeamResource {
  public invites: TeamInvitesResource;
  public members: TeamMembersResource;
  public teams: TeamTeamsResource;

  constructor(private client: Pocketsflow) {
    this.invites = new TeamInvitesResource(client);
    this.members = new TeamMembersResource(client);
    this.teams = new TeamTeamsResource(client);
  }

  /** Seats, members, pending invites and teams. */
  async get(): Promise<TeamOverview> {
    return this.client.request<TeamOverview>('GET', '/team');
  }

  /** The activity log, newest first. Page with `before: nextBefore`. */
  async activity(params: ListTeamActivityParams = {}): Promise<TeamActivityResponse> {
    return this.client.request<TeamActivityResponse>('GET', '/team/activity', { params });
  }
}

/** The one-click offer shown after a product's checkout (Growth plan). */
class PostPurchaseOffersResource {
  constructor(private client: Pocketsflow) {}

  /** A product's post-purchase offer. */
  async get(productId: string): Promise<PostPurchaseOffer> {
    const res = await this.client.request<unknown>(
      'GET',
      `/post-purchase/products/${seg(productId)}`
    );
    return unwrap<PostPurchaseOffer>(res, 'postPurchaseOffer');
  }

  /**
   * Set a product's post-purchase offer (only the fields you send change).
   * Turning it on needs the Growth plan (`FeatureLockedError` otherwise).
   */
  async update(productId: string, params: UpdatePostPurchaseOfferParams): Promise<PostPurchaseOffer> {
    const res = await this.client.request<unknown>(
      'PUT',
      `/post-purchase/products/${seg(productId)}`,
      { body: params }
    );
    return unwrap<PostPurchaseOffer>(res, 'postPurchaseOffer');
  }
}

/** Real-purchase notices on a product's checkout (Growth plan). */
class SocialProofResource {
  constructor(private client: Pocketsflow) {}

  /** What the checkout shows for a product now. Public endpoint. */
  async get(productId: string): Promise<SocialProof> {
    return this.client.request<SocialProof>('GET', `/social-proof/products/${seg(productId)}`);
  }

  /** A product's social proof settings. */
  async getSettings(productId: string): Promise<SocialProofSettings> {
    const res = await this.client.request<unknown>(
      'GET',
      `/social-proof/products/${seg(productId)}/settings`
    );
    return unwrap<SocialProofSettings>(res, 'socialProof');
  }

  /**
   * Change a product's social proof settings (only the fields you send
   * change). Turning it on needs the Growth plan (`FeatureLockedError` otherwise).
   */
  async updateSettings(
    productId: string,
    params: UpdateSocialProofSettingsParams
  ): Promise<SocialProofSettings> {
    const res = await this.client.request<unknown>(
      'PUT',
      `/social-proof/products/${seg(productId)}/settings`,
      { body: params }
    );
    return unwrap<SocialProofSettings>(res, 'socialProof');
  }
}

/**
 * Sales funnels: a free lead magnet, an email sequence and a paid offer.
 * Creating and activating need the Growth plan (`FeatureLockedError`).
 */
class FunnelsResource {
  constructor(private client: Pocketsflow) {}

  /** The email sequence templates (schedule and subjects). */
  async templates(params: ListFunnelTemplatesParams = {}): Promise<FunnelTemplate[]> {
    const res = await this.client.request<unknown>('GET', '/funnels/templates', { params });
    return unwrap<FunnelTemplate[]>(res, 'templates');
  }

  /** Your funnels, with their lead magnet and offer products. */
  async list(): Promise<FunnelListItem[]> {
    const res = await this.client.request<unknown>('GET', '/funnels');
    return unwrap<FunnelListItem[]>(res, 'funnels');
  }

  /** Create a funnel (as a `draft`): its emails, automation and optional discount. */
  async create(params: CreateFunnelParams): Promise<Funnel> {
    return this.client.request<Funnel>('POST', '/funnels', { body: params });
  }

  /** One funnel with its products, emails and activation checklist. */
  async get(id: string): Promise<FunnelDetail> {
    return this.client.request<FunnelDetail>('GET', `/funnels/${seg(id)}`);
  }

  /** Rename a funnel. */
  async rename(id: string, name: string): Promise<Funnel> {
    return this.client.request<Funnel>('PUT', `/funnels/${seg(id)}`, { body: { name } });
  }

  /**
   * Delete a funnel, its leads and its sequence automation. The email posts
   * and the discount stay.
   */
  async delete(id: string): Promise<{ message: string }> {
    return this.client.request<{ message: string }>('DELETE', `/funnels/${seg(id)}`);
  }

  /** Start sending the sequence to new leads (Growth plan). */
  async activate(id: string): Promise<Funnel> {
    return this.client.request<Funnel>('POST', `/funnels/${seg(id)}/activate`);
  }

  /** Pause the funnel: its sequence automation stops sending. */
  async pause(id: string): Promise<Funnel> {
    return this.client.request<Funnel>('POST', `/funnels/${seg(id)}/pause`);
  }

  /** Leads, sends, opens, clicks and attributed sales, per stage and email. */
  async stats(id: string): Promise<FunnelAnalytics> {
    return this.client.request<FunnelAnalytics>('GET', `/funnels/${seg(id)}/stats`);
  }
}

/** License keys issued with your products. */
class LicensesResource {
  constructor(private client: Pocketsflow) {}

  /** Your license keys in the key's mode, newest first. `pageSize` is at most 100. */
  async list(params: ListLicenseKeysParams = {}): Promise<LicenseKeysResponse> {
    return this.client.request<LicenseKeysResponse>('GET', '/licenses', { params });
  }

  /** One license key with its activations. */
  async get(id: string): Promise<LicenseKey> {
    return this.client.request<LicenseKey>('GET', `/licenses/${seg(id)}`);
  }

  /** Disable a key: validation answers `license_disabled` until it is enabled. */
  async disable(id: string): Promise<LicenseKey> {
    return this.client.request<LicenseKey>('POST', `/licenses/${seg(id)}/disable`);
  }

  /** Enable a disabled key. */
  async enable(id: string): Promise<LicenseKey> {
    return this.client.request<LicenseKey>('POST', `/licenses/${seg(id)}/enable`);
  }

  /** Free every activation of a key. */
  async resetActivations(id: string): Promise<LicenseKey> {
    return this.client.request<LicenseKey>('POST', `/licenses/${seg(id)}/reset-activations`);
  }

  /**
   * Check a key a buyer entered (public: no API key needed). Resolves with
   * `valid: false` and a `code` when the key is not valid — it only throws
   * on rate limits, server or network errors.
   */
  async validate(params: LicenseKeyCheckParams): Promise<LicenseValidation> {
    return this.client.request<LicenseValidation>('POST', '/licenses/validate', {
      body: params,
      resolveValidationBody: true,
    });
  }

  /**
   * Activate a key on an instance (public). Omit `instanceId` to get a
   * generated `ins_…` id in `instance.id`. Resolves with `valid: false` and
   * `code: "activation_limit_reached"` when every activation is used.
   */
  async activate(params: LicenseKeyCheckParams): Promise<LicenseValidation> {
    return this.client.request<LicenseValidation>('POST', '/licenses/activate', {
      body: params,
      resolveValidationBody: true,
    });
  }

  /** Free one instance's activation (public). */
  async deactivate(params: DeactivateLicenseKeyParams): Promise<LicenseValidation> {
    return this.client.request<LicenseValidation>('POST', '/licenses/deactivate', {
      body: params,
      resolveValidationBody: true,
    });
  }
}

/** The paid newsletter: membership offers that unlock paid posts (Growth plan). */
class PaidNewsletterResource {
  constructor(private client: Pocketsflow) {}

  /** Settings, offers and stats. */
  async get(): Promise<PaidNewsletter> {
    return this.client.request<PaidNewsletter>('GET', '/newsletters/paid');
  }

  /**
   * Change the settings (only the fields you send change). `enabled: true`
   * needs the Growth plan (`FeatureLockedError` otherwise).
   */
  async update(params: UpdatePaidNewsletterParams): Promise<PaidNewsletter> {
    return this.client.request<PaidNewsletter>('PUT', '/newsletters/paid', { body: params });
  }

  /** Paid and free subscribers, MRR and conversion. */
  async stats(): Promise<PaidNewsletterStats> {
    return this.client.request<PaidNewsletterStats>('GET', '/newsletters/paid/stats');
  }

  /** Re-tag the email list from live memberships (`paid` tag). */
  async sync(): Promise<PaidNewsletterSyncResult> {
    return this.client.request<PaidNewsletterSyncResult>('POST', '/newsletters/paid/sync');
  }
}

/** Audience segments: saved rules over your email list (Growth plan). */
class SegmentsResource {
  constructor(private client: Pocketsflow) {}

  /** Your segments, newest first. */
  async list(params: PaginationParams = {}): Promise<SegmentListResponse> {
    return this.client.request<SegmentListResponse>('GET', '/newsletters/segments', { params });
  }

  /** Create a segment. A smart tag another segment uses is a 409. */
  async create(params: CreateSegmentParams): Promise<Segment> {
    return this.client.request<Segment>('POST', '/newsletters/segments', { body: params });
  }

  /** Count an unsaved definition, with a sample of matching contacts. */
  async preview(definition: SegmentDefinition): Promise<SegmentPreview> {
    return this.client.request<SegmentPreview>('POST', '/newsletters/segments/preview', {
      body: { definition },
    });
  }

  /** One segment. */
  async get(id: string): Promise<Segment> {
    return this.client.request<Segment>('GET', `/newsletters/segments/${seg(id)}`);
  }

  /** Change a segment (only the fields you send change). */
  async update(id: string, params: UpdateSegmentParams): Promise<Segment> {
    return this.client.request<Segment>('POST', `/newsletters/segments/${seg(id)}`, { body: params });
  }

  /** Delete a segment. */
  async delete(id: string): Promise<DeletedResult> {
    return this.client.request<DeletedResult>('DELETE', `/newsletters/segments/${seg(id)}`);
  }

  /** How many contacts match now. */
  async count(id: string): Promise<SegmentCount> {
    return this.client.request<SegmentCount>('GET', `/newsletters/segments/${seg(id)}/count`);
  }

  /** The matching contacts. Page with `after: nextCursor`. */
  async listSubscribers(
    id: string,
    params: ListSegmentSubscribersParams = {}
  ): Promise<SegmentSubscribersResponse> {
    return this.client.request<SegmentSubscribersResponse>(
      'GET',
      `/newsletters/segments/${seg(id)}/subscribers`,
      { params }
    );
  }
}

/** Metered usage on subscriptions with usage pricing (Pro plan). */
class UsageResource {
  constructor(private client: Pocketsflow) {}

  /**
   * Report usage for a subscriber (`_id` or `mem_…` id). `idempotencyKey`
   * is also sent as the `Idempotency-Key` header: a repeat resolves with
   * `replayed: true` and records nothing. A 409 is not retried.
   */
  async report(subscriberId: string, params: ReportUsageParams): Promise<ReportUsageResponse> {
    return this.client.request<ReportUsageResponse>(
      'POST',
      `/subscriptions/${seg(subscriberId)}/usage`,
      {
        body: params,
        headers: params.idempotencyKey ? { 'Idempotency-Key': params.idempotencyKey } : undefined,
      }
    );
  }

  /** A subscriber's usage: the current period, daily units, records and past periods. */
  async get(subscriberId: string, params: GetUsageParams = {}): Promise<UsageSummary> {
    return this.client.request<UsageSummary>('GET', `/subscriptions/${seg(subscriberId)}/usage`, {
      params,
    });
  }
}

/** What a product's checkout offers buyers (public). */
class CheckoutOffersResource {
  constructor(private client: Pocketsflow) {}

  /** The payment plan, exit offer and downsell a checkout shows now. Public endpoint. */
  async get(productId: string): Promise<CheckoutOffers> {
    return this.client.request<CheckoutOffers>('GET', `/checkout-offers/${seg(productId)}`);
  }
}

/** Flash sales: store-wide or per-product discounts for a time window (Growth plan). */
class FlashSalesResource {
  constructor(private client: Pocketsflow) {}

  /** Your flash sales with their stats. */
  async list(params: ListFlashSalesParams = {}): Promise<FlashSaleListResponse> {
    return this.client.request<FlashSaleListResponse>('GET', '/flash-sales', { params });
  }

  /** Schedule a flash sale. */
  async create(params: CreateFlashSaleParams): Promise<FlashSale> {
    return this.client.request<FlashSale>('POST', '/flash-sales', { body: params });
  }

  /** One flash sale. */
  async get(id: string): Promise<FlashSale> {
    return this.client.request<FlashSale>('GET', `/flash-sales/${seg(id)}`);
  }

  /** Change a flash sale (only the fields you send change). */
  async update(id: string, params: UpdateFlashSaleParams): Promise<FlashSale> {
    return this.client.request<FlashSale>('PATCH', `/flash-sales/${seg(id)}`, { body: params });
  }

  /** Delete a flash sale. */
  async delete(id: string): Promise<{ id: string; deleted: boolean }> {
    return this.client.request<{ id: string; deleted: boolean }>('DELETE', `/flash-sales/${seg(id)}`);
  }

  /** Draft the announcement email as a newsletter post. */
  async createAnnouncement(
    id: string,
    params: CreateFlashSaleAnnouncementParams = {}
  ): Promise<FlashSaleAnnouncement> {
    return this.client.request<FlashSaleAnnouncement>(
      'POST',
      `/flash-sales/${seg(id)}/announcement`,
      { body: params }
    );
  }
}

/** Fair pricing: lower prices by the buyer's country (Growth plan). */
class FairPricingResource {
  constructor(private client: Pocketsflow) {}

  /** Your settings and the country tiers. */
  async get(): Promise<FairPricingResponse> {
    return this.client.request<FairPricingResponse>('GET', '/fair-pricing');
  }

  /** Change the settings. Turning them on needs the Growth plan. */
  async update(params: UpdateFairPricingParams): Promise<FairPricingResponse> {
    return this.client.request<FairPricingResponse>('PUT', '/fair-pricing', { body: params });
  }

  /** Sales, revenue and discount given per country. */
  async analytics(params: FairPricingAnalyticsParams = {}): Promise<FairPricingAnalytics> {
    return this.client.request<FairPricingAnalytics>('GET', '/fair-pricing/analytics', { params });
  }
}

/** Early-bird price steps across products, and the public price quote. */
class PricingResource {
  constructor(private client: Pocketsflow) {}

  /** Products with early-bird price steps. */
  async listPriceSteps(): Promise<PriceStepsOverview> {
    return this.client.request<PriceStepsOverview>('GET', '/pricing/early-bird');
  }

  /**
   * The price a buyer pays now (flash sale, fair pricing, early bird, code).
   * Public endpoint.
   */
  async quote(productId: string, params: PriceQuoteParams = {}): Promise<PriceQuote> {
    const { orderBumpIds, ...rest } = params;
    return this.client.request<PriceQuote>('GET', `/pricing/quote/${seg(productId)}`, {
      params: { ...rest, orderBumpIds: orderBumpIds?.length ? orderBumpIds.join(',') : undefined },
    });
  }
}

/** Course drip rules, quizzes and certificates (Growth plan to change them). */
class CoursesResource {
  constructor(private client: Pocketsflow) {}

  /** A course product's lessons with their drip rules and quizzes. */
  async get(productId: string): Promise<CourseSettings> {
    return this.client.request<CourseSettings>('GET', `/courses/${seg(productId)}`);
  }

  /** Set drip rules, quizzes, the certificate and unlock emails. */
  async update(productId: string, params: UpdateCourseSettingsParams): Promise<CourseSettings> {
    return this.client.request<CourseSettings>('PUT', `/courses/${seg(productId)}`, { body: params });
  }

  /** Every lesson quiz of a course. */
  async listQuizzes(productId: string): Promise<CourseLessonQuiz[]> {
    const res = await this.client.request<unknown>('GET', `/courses/${seg(productId)}/quizzes`);
    return unwrap<CourseLessonQuiz[]>(res, 'quizzes');
  }

  /** Create or replace a lesson's quiz. */
  async upsertQuiz(productId: string, lessonId: string, quiz: CourseQuiz): Promise<Required<CourseQuiz>> {
    return this.client.request<Required<CourseQuiz>>(
      'PUT',
      `/courses/${seg(productId)}/quizzes/${seg(lessonId)}`,
      { body: quiz }
    );
  }

  /** Remove a lesson's quiz. */
  async deleteQuiz(productId: string, lessonId: string): Promise<{ deleted: boolean; lessonId: string }> {
    return this.client.request<{ deleted: boolean; lessonId: string }>(
      'DELETE',
      `/courses/${seg(productId)}/quizzes/${seg(lessonId)}`
    );
  }

  /** Enrolment, completion and quiz stats. */
  async stats(productId: string): Promise<CourseStats> {
    return this.client.request<CourseStats>('GET', `/courses/${seg(productId)}/stats`);
  }
}

/** Course certificates (public verification). */
class CertificatesResource {
  constructor(private client: Pocketsflow) {}

  /** Verify a certificate by its id. Public endpoint. */
  async verify(verifyId: string): Promise<Certificate> {
    return this.client.request<Certificate>('GET', `/certificates/${seg(verifyId)}`);
  }
}

/**
 * Analytics: headline numbers on every plan, advanced reports on Growth and
 * MRR on Pro (`FeatureLockedError` below).
 */
class AnalyticsResource {
  constructor(private client: Pocketsflow) {}

  /** Headline funnel, top source and MRR (every plan). */
  async preview(params: AnalyticsRangeParams = {}): Promise<AnalyticsPreview> {
    return this.client.request<AnalyticsPreview>('GET', '/analytics/preview', { params });
  }

  /** Key metrics against the previous period (Growth plan). */
  async summary(params: AnalyticsRangeParams = {}): Promise<AnalyticsSummary> {
    return this.client.request<AnalyticsSummary>('GET', '/analytics/advanced/summary', { params });
  }

  /** Visits → product views → checkouts → paid, by source and product (Growth plan). */
  async funnel(params: AnalyticsRangeParams = {}): Promise<SalesFunnelReport> {
    return this.client.request<SalesFunnelReport>('GET', '/analytics/advanced/funnel', { params });
  }

  /** Revenue by referrer or UTM tag (Growth plan). */
  async revenueBySource(params: RevenueBySourceParams = {}): Promise<RevenueBySource> {
    return this.client.request<RevenueBySource>('GET', '/analytics/advanced/sources', { params });
  }

  /** Repeat-buyer cohorts by first-purchase month (Growth plan). */
  async cohorts(params: RepeatBuyerCohortsParams = {}): Promise<RepeatBuyerCohorts> {
    return this.client.request<RepeatBuyerCohorts>('GET', '/analytics/advanced/cohorts', { params });
  }

  /** Net revenue after refunds by product, country or month (Growth plan). */
  async netRevenue(params: NetRevenueParams = {}): Promise<NetRevenue> {
    return this.client.request<NetRevenue>('GET', '/analytics/advanced/net-revenue', { params });
  }

  /** MRR, churn, ARPU and LTV (Pro plan). */
  async mrr(params: MrrParams = {}): Promise<MrrReport> {
    return this.client.request<MrrReport>('GET', '/analytics/mrr', { params });
  }
}

/** Personal deadlines: an offer with its own countdown per contact (Pro plan). */
class PersonalDeadlinesResource {
  constructor(private client: Pocketsflow) {}

  /** Your deadlines with their stats. */
  async list(): Promise<PersonalDeadline[]> {
    return this.client.request<PersonalDeadline[]>('GET', '/personal-deadlines');
  }

  /** Create a deadline. */
  async create(params: CreatePersonalDeadlineParams): Promise<PersonalDeadline> {
    return this.client.request<PersonalDeadline>('POST', '/personal-deadlines', { body: params });
  }

  /** One deadline. */
  async get(id: string): Promise<PersonalDeadline> {
    return this.client.request<PersonalDeadline>('GET', `/personal-deadlines/${seg(id)}`);
  }

  /** Change a deadline (only the fields you send change). */
  async update(id: string, params: UpdatePersonalDeadlineParams): Promise<PersonalDeadline> {
    return this.client.request<PersonalDeadline>('POST', `/personal-deadlines/${seg(id)}`, {
      body: params,
    });
  }

  /** Delete a deadline. */
  async delete(id: string): Promise<MessageResult> {
    return this.client.request<MessageResult>('DELETE', `/personal-deadlines/${seg(id)}`);
  }

  /** The people on a deadline, newest first. Page with `before: nextCursor`. */
  async listEntries(
    id: string,
    params: ListPersonalDeadlineEntriesParams = {}
  ): Promise<PersonalDeadlineEntriesResponse> {
    return this.client.request<PersonalDeadlineEntriesResponse>(
      'GET',
      `/personal-deadlines/${seg(id)}/entries`,
      { params }
    );
  }

  /** Start someone's clock now; resolves with their personal link. */
  async start(id: string, params: { email: string }): Promise<PersonalDeadlineLink> {
    return this.client.request<PersonalDeadlineLink>('POST', `/personal-deadlines/${seg(id)}/start`, {
      body: params,
    });
  }

  /** Someone's personal link (it does not start the clock). */
  async getLink(id: string, params: { email: string }): Promise<PersonalDeadlineLink> {
    return this.client.request<PersonalDeadlineLink>('GET', `/personal-deadlines/${seg(id)}/link`, {
      params,
    });
  }

  /** A visitor's personal offer on a product. Public endpoint. */
  async getPublicOffer(params: PersonalOfferParams): Promise<PersonalOffer> {
    return this.client.request<PersonalOffer>('GET', '/personal-deadlines/public/offer', { params });
  }
}

/**
 * Subscription retention: failed payment recovery, cancellation save offers
 * and intro pricing (Pro plan to turn them on).
 */
class RetentionResource {
  constructor(private client: Pocketsflow) {}

  /** Recovered and at-risk revenue over the last `days`. */
  async recoverySummary(params: RecoverySummaryParams = {}): Promise<RecoverySummary> {
    return this.client.request<RecoverySummary>('GET', '/subscription-retention/recovery/summary', {
      params,
    });
  }

  /** Subscriptions with a failed payment. */
  async listAtRisk(params: ListAtRiskParams = {}): Promise<PaymentRecoveryPage> {
    return this.client.request<PaymentRecoveryPage>('GET', '/subscription-retention/recovery/at-risk', {
      params,
    });
  }

  /** Failed payment recovery settings. */
  async getRecoverySettings(): Promise<RecoverySettings> {
    return this.client.request<RecoverySettings>('GET', '/subscription-retention/recovery/settings');
  }

  /** Change the recovery settings (turning them on needs the Pro plan). */
  async updateRecoverySettings(params: UpdateRecoverySettingsParams): Promise<RecoverySettings> {
    return this.client.request<RecoverySettings>('PUT', '/subscription-retention/recovery/settings', {
      body: params,
    });
  }

  /** Subscriptions saved by a pause or discount, and the cancel reasons. */
  async saveOffersReport(params: SaveOffersReportParams = {}): Promise<SaveOffersReport> {
    return this.client.request<SaveOffersReport>('GET', '/subscription-retention/save-offers/report', {
      params,
    });
  }

  /** Intro pricing and yearly switch numbers. */
  async introReport(): Promise<IntroPricingReport> {
    return this.client.request<IntroPricingReport>('GET', '/subscription-retention/intro/report');
  }

  /** Retention settings of every subscription offer. */
  async listOffers(): Promise<RetentionOffersList> {
    return this.client.request<RetentionOffersList>('GET', '/subscription-retention/offers');
  }

  /** One subscription offer's retention settings. */
  async getOffer(subscriptionId: string): Promise<RetentionOffer> {
    return this.client.request<RetentionOffer>(
      'GET',
      `/subscription-retention/offers/${seg(subscriptionId)}`
    );
  }

  /**
   * Change an offer's save offers, intro price or yearly switch. A bad value
   * is a 400 with `code: "INVALID_RETENTION_CONFIG"` and `body.field`.
   */
  async updateOffer(subscriptionId: string, params: UpdateRetentionOfferParams): Promise<RetentionOffer> {
    return this.client.request<RetentionOffer>(
      'PUT',
      `/subscription-retention/offers/${seg(subscriptionId)}`,
      { body: params }
    );
  }
}

/** Product bundles (Growth plan). */
class BundlesResource {
  constructor(private client: Pocketsflow) {}

  /** Your bundles. */
  async list(): Promise<Bundle[]> {
    const res = await this.client.request<unknown>('GET', '/bundles');
    return unwrap<Bundle[]>(res, 'bundles');
  }

  /** A product's bundle (`productIds` is `[]` when it is not one). */
  async get(productId: string): Promise<Bundle> {
    const res = await this.client.request<unknown>('GET', `/bundles/${seg(productId)}`);
    return unwrap<Bundle>(res, 'bundle');
  }

  /** Make a product a bundle of 2–10 products, or change what it includes. */
  async update(productId: string, params: UpdateBundleParams): Promise<Bundle> {
    const res = await this.client.request<unknown>('PUT', `/bundles/${seg(productId)}`, {
      body: params,
    });
    return unwrap<Bundle>(res, 'bundle');
  }

  /** Turn a bundle back into a normal product. */
  async delete(productId: string): Promise<Bundle> {
    const res = await this.client.request<unknown>('DELETE', `/bundles/${seg(productId)}`);
    return unwrap<Bundle>(res, 'bundle');
  }
}

/** "Buy more, save more": a percent off carts with more items (Growth plan). */
class TieredDiscountsResource {
  constructor(private client: Pocketsflow) {}

  /** Your tiers. */
  async get(): Promise<TieredDiscounts> {
    const res = await this.client.request<unknown>('GET', '/tiered-discounts');
    return unwrap<TieredDiscounts>(res, 'tieredDiscounts');
  }

  /** Save your tiers (only the fields you send change). */
  async update(params: UpdateTieredDiscountsParams): Promise<TieredDiscounts> {
    const res = await this.client.request<unknown>('PUT', '/tiered-discounts', { body: params });
    return unwrap<TieredDiscounts>(res, 'tieredDiscounts');
  }

  /** Remove your tiers. */
  async delete(): Promise<TieredDiscounts> {
    const res = await this.client.request<unknown>('DELETE', '/tiered-discounts');
    return unwrap<TieredDiscounts>(res, 'tieredDiscounts');
  }
}

/**
 * Revenue splits: share a product's sales with co-creators. Inviting needs
 * the Growth plan; money fields ending in `Cents` are integer cents.
 */
class RevenueSplitsResource {
  constructor(private client: Pocketsflow) {}

  /** The splits on your products. */
  async list(params: ListRevenueSplitsParams = {}): Promise<RevenueSplit[]> {
    const res = await this.client.request<unknown>('GET', '/revenue-splits', { params });
    return unwrap<RevenueSplit[]>(res, 'splits');
  }

  /** Invite a co-creator to a share of a product (status `invited`). */
  async create(params: CreateRevenueSplitParams): Promise<RevenueSplit> {
    return this.client.request<RevenueSplit>('POST', '/revenue-splits', { body: params });
  }

  /** One split. */
  async get(id: string): Promise<RevenueSplit> {
    return this.client.request<RevenueSplit>('GET', `/revenue-splits/${seg(id)}`);
  }

  /** Remove a split: sales from now on are no longer shared. */
  async remove(id: string): Promise<RevenueSplit> {
    return this.client.request<RevenueSplit>('DELETE', `/revenue-splits/${seg(id)}`);
  }

  /** Send the invitation email again. */
  async resend(id: string): Promise<RevenueSplit> {
    return this.client.request<RevenueSplit>('POST', `/revenue-splits/${seg(id)}/resend`);
  }

  /** A product's splits, shares and free slots. */
  async product(productId: string): Promise<ProductRevenueSplit> {
    return this.client.request<ProductRevenueSplit>(
      'GET',
      `/revenue-splits/products/${seg(productId)}`
    );
  }

  /** Split sales, newest first. Page with `cursor: nextCursor`. */
  async sales(params: ListRevenueSplitSalesParams = {}): Promise<RevenueSplitSalesResponse> {
    return this.client.request<RevenueSplitSalesResponse>('GET', '/revenue-splits/sales', { params });
  }

  /** How one order was split. */
  async sale(orderId: string): Promise<RevenueSplitSale> {
    return this.client.request<RevenueSplitSale>('GET', `/revenue-splits/sales/${seg(orderId)}`);
  }

  /** Split invitations sent to you. */
  async invites(): Promise<RevenueSplit[]> {
    const res = await this.client.request<unknown>('GET', '/revenue-splits/invites');
    return unwrap<RevenueSplit[]>(res, 'invites');
  }

  /** Accept an invitation (needs payouts set up). */
  async accept(inviteId: string): Promise<RevenueSplit> {
    return this.client.request<RevenueSplit>('POST', `/revenue-splits/invites/${seg(inviteId)}/accept`);
  }

  /** Decline an invitation. */
  async decline(inviteId: string): Promise<RevenueSplit> {
    return this.client.request<RevenueSplit>('POST', `/revenue-splits/invites/${seg(inviteId)}/decline`);
  }

  /** Your earnings from products shared with you. */
  async earnings(params: RevenueSplitEarningsParams = {}): Promise<RevenueSplitEarnings> {
    return this.client.request<RevenueSplitEarnings>('GET', '/revenue-splits/earnings', { params });
  }
}

/** Embeddable email signup forms (Growth plan to create or edit). */
class SignupFormsResource {
  constructor(private client: Pocketsflow) {}

  /** Your forms with their stats. */
  async list(params: ListSignupFormsParams = {}): Promise<SignupForm[]> {
    const res = await this.client.request<unknown>('GET', '/forms', {
      params: { archived: params.archived === undefined ? undefined : String(params.archived) },
    });
    return unwrap<SignupForm[]>(res, 'forms');
  }

  /** Create a form; the result carries its embed `script` and `iframe`. */
  async create(params: CreateSignupFormParams): Promise<SignupForm> {
    return this.client.request<SignupForm>('POST', '/forms', { body: params });
  }

  /** One form with 30 days of daily stats. */
  async get(id: string): Promise<SignupFormDetail> {
    return this.client.request<SignupFormDetail>('GET', `/forms/${seg(id)}`);
  }

  /** Change, pause or archive a form (pausing and archiving are always allowed). */
  async update(id: string, params: UpdateSignupFormParams): Promise<SignupForm> {
    return this.client.request<SignupForm>('PATCH', `/forms/${seg(id)}`, { body: params });
  }

  /** Delete a form. */
  async delete(id: string): Promise<DeletedResult> {
    return this.client.request<DeletedResult>('DELETE', `/forms/${seg(id)}`);
  }

  /** A form's public config, as the embed reads it. Public endpoint. */
  async getPublic(id: string): Promise<PublicSignupForm> {
    return this.client.request<PublicSignupForm>('GET', `/forms/public/${seg(id)}`);
  }

  /** Sign someone up through a form. Public endpoint (10 per 15 minutes per IP). */
  async subscribe(id: string, params: SignupFormSubscribeParams): Promise<SignupFormSubscribeResult> {
    return this.client.request<SignupFormSubscribeResult>('POST', `/forms/public/${seg(id)}/subscribe`, {
      body: params,
    });
  }
}

/** Buyer testimonials: requests, moderation and the public wall (Growth plan). */
class TestimonialsResource {
  constructor(private client: Pocketsflow) {}

  /** Testimonials to moderate (default: `pending`). */
  async list(params: ListTestimonialsParams = {}): Promise<TestimonialList> {
    return this.client.request<TestimonialList>('GET', '/testimonials', { params });
  }

  /** One testimonial. */
  async get(id: string): Promise<Testimonial> {
    return this.client.request<Testimonial>('GET', `/testimonials/${seg(id)}`);
  }

  /** Approve, feature or hide a testimonial (approving needs the Growth plan). */
  async moderate(id: string, params: ModerateTestimonialParams): Promise<Testimonial> {
    return this.client.request<Testimonial>('PATCH', `/testimonials/${seg(id)}`, { body: params });
  }

  /** Request emails, the wall and the checkout strip. */
  async getSettings(): Promise<TestimonialSettings> {
    const res = await this.client.request<unknown>('GET', '/testimonials/settings');
    return unwrap<TestimonialSettings>(res, 'settings');
  }

  /** Change the settings (a switch turned on needs the Growth plan). */
  async updateSettings(params: UpdateTestimonialSettingsParams): Promise<TestimonialSettings> {
    const res = await this.client.request<unknown>('PUT', '/testimonials/settings', { body: params });
    return unwrap<TestimonialSettings>(res, 'settings');
  }

  /** A product's approved testimonials. Public endpoint. */
  async wall(productId: string): Promise<TestimonialWall> {
    return this.client.request<TestimonialWall>(
      'GET',
      `/testimonials/public/products/${seg(productId)}`
    );
  }
}

/** The "How did you hear about us?" question on the thank-you page (Growth plan). */
class AttributionSurveyResource {
  constructor(private client: Pocketsflow) {}

  /** The survey. */
  async get(): Promise<AttributionSurvey> {
    const res = await this.client.request<unknown>('GET', '/attribution-survey/settings');
    return unwrap<AttributionSurvey>(res, 'survey');
  }

  /** Change the survey (`enabled: true` needs the Growth plan). */
  async update(params: UpdateAttributionSurveyParams): Promise<AttributionSurvey> {
    const res = await this.client.request<unknown>('PUT', '/attribution-survey/settings', {
      body: params,
    });
    return unwrap<AttributionSurvey>(res, 'survey');
  }

  /** Answers and revenue per channel, next to your tracked links. */
  async report(params: AttributionReportParams = {}): Promise<AttributionReport> {
    return this.client.request<AttributionReport>('GET', '/attribution-survey/report', { params });
  }
}

/** How your store compares with similar stores (Pro plan). */
class BenchmarksResource {
  constructor(private client: Pocketsflow) {}

  /** Conversion, average order, refund and email open rates against your cohort. */
  async get(): Promise<Benchmarks> {
    return this.client.request<Benchmarks>('GET', '/benchmarks');
  }
}

/** Members-only posts of a membership. */
class MemberPostsResource {
  constructor(private client: Pocketsflow) {}

  /** A membership's posts, pinned first (HTML left out). */
  async list(membershipId: string, params: { page?: number } = {}): Promise<MemberPostsPage> {
    return this.client.request<MemberPostsPage>('GET', `/memberships/${seg(membershipId)}/posts`, {
      params,
    });
  }

  /** Write a post (Pro plan). `notify: true` emails members when it is published. */
  async create(membershipId: string, params: CreateMemberPostParams): Promise<MemberPost> {
    return this.client.request<MemberPost>('POST', `/memberships/${seg(membershipId)}/posts`, {
      body: params,
    });
  }

  /** One post with its HTML. */
  async get(membershipId: string, postId: string): Promise<MemberPost> {
    return this.client.request<MemberPost>(
      'GET',
      `/memberships/${seg(membershipId)}/posts/${seg(postId)}`
    );
  }

  /** Edit, publish or pin a post. */
  async update(membershipId: string, postId: string, params: MemberPostParams): Promise<MemberPost> {
    return this.client.request<MemberPost>(
      'PUT',
      `/memberships/${seg(membershipId)}/posts/${seg(postId)}`,
      { body: params }
    );
  }

  /** Delete a post. */
  async delete(membershipId: string, postId: string): Promise<MessageResult> {
    return this.client.request<MessageResult>(
      'DELETE',
      `/memberships/${seg(membershipId)}/posts/${seg(postId)}`
    );
  }
}

/** Community threads of a membership. */
class CommunityThreadsResource {
  constructor(private client: Pocketsflow) {}

  /** Threads, pinned first then by last activity. */
  async list(membershipId: string, params: ListCommunityThreadsParams = {}): Promise<CommunityThreadsPage> {
    return this.client.request<CommunityThreadsPage>(
      'GET',
      `/memberships/${seg(membershipId)}/threads`,
      { params }
    );
  }

  /** Start a thread as the creator (Pro plan). */
  async create(membershipId: string, params: CreateCommunityThreadParams): Promise<CommunityThread> {
    return this.client.request<CommunityThread>('POST', `/memberships/${seg(membershipId)}/threads`, {
      body: params,
    });
  }

  /** A thread with a page of its replies. */
  async get(
    membershipId: string,
    threadId: string,
    params: { page?: number } = {}
  ): Promise<CommunityThreadDetail> {
    return this.client.request<CommunityThreadDetail>(
      'GET',
      `/memberships/${seg(membershipId)}/threads/${seg(threadId)}`,
      { params }
    );
  }

  /** Pin, lock or hide a thread. */
  async moderate(
    membershipId: string,
    threadId: string,
    params: ModerateCommunityThreadParams
  ): Promise<CommunityThread> {
    return this.client.request<CommunityThread>(
      'PATCH',
      `/memberships/${seg(membershipId)}/threads/${seg(threadId)}`,
      { body: params }
    );
  }

  /** Delete a thread and its replies. */
  async delete(membershipId: string, threadId: string): Promise<MessageResult> {
    return this.client.request<MessageResult>(
      'DELETE',
      `/memberships/${seg(membershipId)}/threads/${seg(threadId)}`
    );
  }

  /** Reply as the creator (Pro plan). */
  async reply(membershipId: string, threadId: string, params: { body: string }): Promise<CommunityReply> {
    return this.client.request<CommunityReply>(
      'POST',
      `/memberships/${seg(membershipId)}/threads/${seg(threadId)}/replies`,
      { body: params }
    );
  }
}

/** Community replies of a membership. */
class CommunityRepliesResource {
  constructor(private client: Pocketsflow) {}

  /** Hide or unhide a reply. */
  async moderate(membershipId: string, replyId: string, params: { hidden: boolean }): Promise<CommunityReply> {
    return this.client.request<CommunityReply>(
      'PATCH',
      `/memberships/${seg(membershipId)}/replies/${seg(replyId)}`,
      { body: params }
    );
  }

  /** Delete a reply. */
  async delete(membershipId: string, replyId: string): Promise<MessageResult> {
    return this.client.request<MessageResult>(
      'DELETE',
      `/memberships/${seg(membershipId)}/replies/${seg(replyId)}`
    );
  }
}

/**
 * Memberships: subscription offers that unlock products, members-only posts
 * and a community (Pro plan to create or edit).
 */
class MembershipsResource {
  public posts: MemberPostsResource;
  public threads: CommunityThreadsResource;
  public replies: CommunityRepliesResource;

  constructor(private client: Pocketsflow) {
    this.posts = new MemberPostsResource(client);
    this.threads = new CommunityThreadsResource(client);
    this.replies = new CommunityRepliesResource(client);
  }

  /** Your memberships with their stats. */
  async list(): Promise<Membership[]> {
    const res = await this.client.request<unknown>('GET', '/memberships');
    return unwrap<Membership[]>(res, 'memberships');
  }

  /** Create a membership over 1–10 of your subscription offers. */
  async create(params: CreateMembershipParams): Promise<Membership> {
    return this.client.request<Membership>('POST', '/memberships', { body: params });
  }

  /** One membership. */
  async get(id: string): Promise<Membership> {
    return this.client.request<Membership>('GET', `/memberships/${seg(id)}`);
  }

  /** Change or archive a membership (only the fields you send change). */
  async update(id: string, params: UpdateMembershipParams): Promise<Membership> {
    return this.client.request<Membership>('PUT', `/memberships/${seg(id)}`, { body: params });
  }

  /** Delete a membership with its posts and community. */
  async delete(id: string): Promise<MessageResult> {
    return this.client.request<MessageResult>('DELETE', `/memberships/${seg(id)}`);
  }

  /** A membership's members (20 per page). */
  async listMembers(id: string, params: ListMembershipMembersParams = {}): Promise<MembershipMembersPage> {
    return this.client.request<MembershipMembersPage>('GET', `/memberships/${seg(id)}/members`, {
      params,
    });
  }

  /** Ban someone from all your communities (they keep their products). */
  async banMember(params: BanMemberParams): Promise<MemberBanResult> {
    return this.client.request<MemberBanResult>('POST', '/memberships/members/ban', { body: params });
  }

  /** Lift a community ban. */
  async unbanMember(params: { email: string }): Promise<MemberBanResult> {
    return this.client.request<MemberBanResult>('POST', '/memberships/members/unban', { body: params });
  }
}

/**
 * Creator services: priority support (Pro), an account manager and dispute
 * cover (Volume). Reads are never locked.
 */
class CreatorServicesResource {
  constructor(private client: Pocketsflow) {}

  /** Which services your plan includes, with their state. */
  async get(): Promise<CreatorServices> {
    return this.client.request<CreatorServices>('GET', '/creator-services');
  }

  /** Your account manager and shared Slack channel (Volume plan). */
  async getAccountManager(): Promise<AccountManagerView> {
    return this.client.request<AccountManagerView>('GET', '/creator-services/account-manager');
  }

  /** Ask for a shared Slack channel with your account manager (Volume plan). */
  async requestSlackChannel(params: RequestSlackChannelParams = {}): Promise<AccountManagerView> {
    return this.client.request<AccountManagerView>(
      'POST',
      '/creator-services/account-manager/slack-channel',
      { body: params }
    );
  }

  /** Your dispute help requests. */
  async listDisputeHelp(params: ListDisputeHelpParams = {}): Promise<DisputeHelpRequest[]> {
    const res = await this.client.request<unknown>('GET', '/creator-services/dispute-help', { params });
    return unwrap<DisputeHelpRequest[]>(res, 'requests');
  }

  /**
   * Ask the team to answer a dispute for you (Pro plan). One open request
   * per order: a second one is a 409 with `code: "ALREADY_REQUESTED"`.
   */
  async createDisputeHelp(params: CreateDisputeHelpParams): Promise<DisputeHelpRequest> {
    const res = await this.client.request<unknown>('POST', '/creator-services/dispute-help', {
      body: params,
    });
    return unwrap<DisputeHelpRequest>(res, 'request');
  }

  /** Disputes covered (or excluded) by dispute cover, newest first. */
  async listDisputeCovers(params: ListDisputeCoversParams = {}): Promise<DisputeCover[]> {
    const res = await this.client.request<unknown>('GET', '/creator-services/dispute-covers', { params });
    return unwrap<DisputeCover[]>(res, 'covers');
  }

  /** The dispute cover of one order (404 when there is none). */
  async getDisputeCover(saleId: string): Promise<DisputeCover> {
    const res = await this.client.request<unknown>(
      'GET',
      `/creator-services/dispute-covers/${seg(saleId)}`
    );
    return unwrap<DisputeCover>(res, 'cover');
  }
}

/** Sync sales and customers to a Google Sheet (Pro plan). */
class SheetsSyncResource {
  constructor(private client: Pocketsflow) {}

  /** Whether sync is available, allowed and connected. */
  async get(): Promise<SheetsSyncState> {
    return this.client.request<SheetsSyncState>('GET', '/sheets-sync');
  }

  /** Start connecting a Google account: open the returned `url` (the consent page). */
  async connect(): Promise<{ url: string }> {
    return this.client.request<{ url: string }>('POST', '/sheets-sync/connect');
  }

  /** Create a spreadsheet or choose an existing one. */
  async setSpreadsheet(params: SetSpreadsheetParams): Promise<SheetsConnection> {
    const res = await this.client.request<unknown>('PUT', '/sheets-sync/spreadsheet', { body: params });
    return unwrap<SheetsConnection>(res, 'connection');
  }

  /** Choose what to sync. */
  async update(params: UpdateSheetsSyncParams): Promise<SheetsConnection> {
    const res = await this.client.request<unknown>('PATCH', '/sheets-sync', { body: params });
    return unwrap<SheetsConnection>(res, 'connection');
  }

  /** Add the sales of the last `days` (1–365). */
  async backfill(params: { days: number }): Promise<SheetsConnection> {
    const res = await this.client.request<unknown>('POST', '/sheets-sync/backfill', { body: params });
    return unwrap<SheetsConnection>(res, 'connection');
  }

  /** Sync now (at most once a minute). */
  async syncNow(): Promise<SheetsSyncNowResult> {
    return this.client.request<SheetsSyncNowResult>('POST', '/sheets-sync/sync');
  }

  /** Queue the failed rows again. */
  async retryFailed(): Promise<SheetsRetryResult> {
    return this.client.request<SheetsRetryResult>('POST', '/sheets-sync/retry');
  }

  /** Disconnect Google Sheets. */
  async disconnect(): Promise<{ disconnected: boolean }> {
    return this.client.request<{ disconnected: boolean }>('DELETE', '/sheets-sync');
  }
}

/** Your referral link: free months for stores that sign up through it. */
class ReferralsResource {
  constructor(private client: Pocketsflow) {}

  /** Your referral link, code and what it earned. */
  async stats(): Promise<ReferralStats> {
    return this.client.request<ReferralStats>('GET', '/referrals/me');
  }

  /** The stores you referred, newest first. Page with `before: nextCursor`. */
  async list(params: ListReferredStoresParams = {}): Promise<ReferredStoresPage> {
    return this.client.request<ReferredStoresPage>('GET', '/referrals/referred', { params });
  }
}

/** Newsletter recommendations: creators you suggest to new subscribers. */
class RecommendationsResource {
  constructor(private client: Pocketsflow) {}

  /** Your picks and who recommends you. */
  async get(): Promise<RecommendationSettings> {
    return this.client.request<RecommendationSettings>('GET', '/recommendations');
  }

  /** Change your settings or picks (at most 3). */
  async update(params: UpdateRecommendationsParams): Promise<RecommendationSettings> {
    return this.client.request<RecommendationSettings>('PUT', '/recommendations', { body: params });
  }

  /** Find creators you can recommend. */
  async search(q: string): Promise<CreatorCard[]> {
    const res = await this.client.request<unknown>('GET', '/recommendations/search', { params: { q } });
    return unwrap<CreatorCard[]>(res, 'results');
  }
}

/** The agency program: manage client stores and earn a revenue share. */
class AgencyResource {
  constructor(private client: Pocketsflow) {}

  /** Your agency (404 `NOT_AGENCY` when you have not joined). */
  async get(): Promise<Agency> {
    return this.client.request<Agency>('GET', '/agency');
  }

  /** Join the agency program. */
  async create(params: CreateAgencyParams): Promise<Agency> {
    return this.client.request<Agency>('POST', '/agency', { body: params });
  }

  /** Change your agency's name or website. */
  async update(params: UpdateAgencyParams): Promise<Agency> {
    return this.client.request<Agency>('PATCH', '/agency', { body: params });
  }

  /** Your client stores and totals. */
  async clients(): Promise<AgencyOverview> {
    return this.client.request<AgencyOverview>('GET', '/agency/clients');
  }

  /** Stop managing a client store. */
  async removeClient(storeUserId: string): Promise<OkResult> {
    return this.client.request<OkResult>('DELETE', `/agency/clients/${seg(storeUserId)}`);
  }

  /** Your monthly statements, newest first. */
  async statements(): Promise<AgencyStatementRow[]> {
    const res = await this.client.request<unknown>('GET', '/agency/statements');
    return unwrap<AgencyStatementRow[]>(res, 'statements');
  }

  /** One monthly statement (`YYYY-MM`) with its lines. */
  async statement(month: string): Promise<AgencyStatement> {
    return this.client.request<AgencyStatement>('GET', `/agency/statements/${seg(month)}`);
  }
}

/** The agency that manages your store. */
class AgencyAccessResource {
  constructor(private client: Pocketsflow) {}

  /** Your store's agency, or null. */
  async get(): Promise<StoreAgency | null> {
    const res = await this.client.request<unknown>('GET', '/agency-access');
    return unwrap<StoreAgency | null>(res, 'agency');
  }

  /** Look up an agency code before inviting it. */
  async preview(code: string): Promise<AgencyPreview> {
    return this.client.request<AgencyPreview>('GET', `/agency-access/preview/${seg(code)}`);
  }

  /** Give an agency admin access to your store. */
  async invite(code: string): Promise<StoreAgency | null> {
    const res = await this.client.request<unknown>('POST', '/agency-access', { body: { code } });
    return unwrap<StoreAgency | null>(res, 'agency');
  }

  /** Remove your store's agency. */
  async remove(): Promise<OkResult> {
    return this.client.request<OkResult>('DELETE', '/agency-access');
  }
}

/** A/B tests on a product's price, headline, cover or checkout layout (Pro plan). */
class AbTestsResource {
  constructor(private client: Pocketsflow) {}

  /** Your tests, newest first, with visitors and conversions. */
  async list(params: ListAbTestsParams = {}): Promise<AbTest[]> {
    return this.client.request<AbTest[]>('GET', '/ab-tests', { params });
  }

  /** Start a test (one running test per product). */
  async create(params: CreateAbTestParams): Promise<AbTest> {
    return this.client.request<AbTest>('POST', '/ab-tests', { body: params });
  }

  /** A test with its results. */
  async get(id: string, params: AbTestTimezoneParams = {}): Promise<AbTest> {
    return this.client.request<AbTest>('GET', `/ab-tests/${seg(id)}`, { params });
  }

  /** A test's results per variant. */
  async results(id: string, params: AbTestTimezoneParams = {}): Promise<AbTestResults> {
    return this.client.request<AbTestResults>('GET', `/ab-tests/${seg(id)}/results`, { params });
  }

  /** Stop a running test without changing the product. */
  async stop(id: string): Promise<AbTest> {
    return this.client.request<AbTest>('POST', `/ab-tests/${seg(id)}/stop`);
  }

  /** End a test and apply the winning variant to the product. */
  async declareWinner(id: string, params: { variantId: string }): Promise<AbTestWinner> {
    return this.client.request<AbTestWinner>('POST', `/ab-tests/${seg(id)}/winner`, { body: params });
  }

  /** Delete an ended test. */
  async delete(id: string): Promise<MessageResult> {
    return this.client.request<MessageResult>('DELETE', `/ab-tests/${seg(id)}`);
  }

  /** A visitor's variant of a product (`test: null` when none runs). Public endpoint. */
  async assign(params: AssignAbTestVariantParams): Promise<AbAssignment> {
    return this.client.request<AbAssignment>('POST', '/ab-tests/public/assign', { body: params });
  }
}

/** Loyalty points and store credit (Growth plan to turn them on). */
class LoyaltyResource {
  constructor(private client: Pocketsflow) {}

  /** Earn and redeem rates, expiry and currency. */
  async getSettings(): Promise<LoyaltySettings> {
    return this.client.request<LoyaltySettings>('GET', '/loyalty');
  }

  /** Change the settings (only the fields you send change). */
  async updateSettings(params: UpdateLoyaltySettingsParams): Promise<LoyaltySettings> {
    return this.client.request<LoyaltySettings>('PUT', '/loyalty', { body: params });
  }

  /** Outstanding points and credit (your liability), earned and redeemed. */
  async getSummary(): Promise<LoyaltySummary> {
    return this.client.request<LoyaltySummary>('GET', '/loyalty/summary');
  }

  /** Buyers with a points balance. */
  async listMembers(params: ListLoyaltyMembersParams = {}): Promise<LoyaltyMembersResponse> {
    return this.client.request<LoyaltyMembersResponse>('GET', '/loyalty/members', { params });
  }

  /** The points ledger, newest first. */
  async listActivity(params: ListLoyaltyActivityParams = {}): Promise<LoyaltyActivityResponse> {
    return this.client.request<LoyaltyActivityResponse>('GET', '/loyalty/ledger', { params });
  }

  /** Add or remove a buyer's points. */
  async adjustPoints(params: AdjustLoyaltyPointsParams): Promise<LoyaltyAdjustment> {
    return this.client.request<LoyaltyAdjustment>('POST', '/loyalty/members/adjust', { body: params });
  }
}

/** Tiered affiliate commissions and milestone bonuses (Pro plan to turn them on). */
class AffiliateTiersResource {
  constructor(private client: Pocketsflow) {}

  /** Your tiers, bonuses and period. */
  async get(): Promise<AffiliateProgram> {
    return this.client.request<AffiliateProgram>('GET', '/affiliate-program');
  }

  /** Change the tiers and bonuses (each list is replaced). */
  async update(params: UpdateAffiliateTiersParams): Promise<AffiliateProgram> {
    return this.client.request<AffiliateProgram>('PUT', '/affiliate-program', { body: params });
  }

  /** Every affiliate's tier progress. */
  async listProgress(): Promise<AffiliateTierProgressList> {
    return this.client.request<AffiliateTierProgressList>('GET', '/affiliate-program/affiliates');
  }

  /** One affiliate's tier progress and bonuses. */
  async getProgress(id: string): Promise<AffiliateTierProgressDetail> {
    return this.client.request<AffiliateTierProgressDetail>(
      'GET',
      `/affiliate-program/affiliates/${seg(id)}`
    );
  }

  /** Milestone bonuses, newest first. */
  async listBonuses(params: ListAffiliateBonusesParams = {}): Promise<AffiliateBonusesResponse> {
    return this.client.request<AffiliateBonusesResponse>('GET', '/affiliate-program/bonuses', { params });
  }

  /** Your own progress as an affiliate of other stores. */
  async mine(): Promise<MyAffiliateTierProgress> {
    return this.client.request<MyAffiliateTierProgress>('GET', '/affiliate-program/mine');
  }
}

/**
 * Import products, customers, orders and subscribers from another platform
 * (Volume plan to write; reads and `cancel` are never locked).
 */
class MigrationsResource {
  constructor(private client: Pocketsflow) {}

  /** Platforms you can import from, with their CSV columns. */
  async platforms(): Promise<MigrationPlatform[]> {
    const res = await this.client.request<unknown>('GET', '/migrations/platforms');
    return unwrap<MigrationPlatform[]>(res, 'platforms');
  }

  /** Your imports, newest first. */
  async list(params: PaginationParams = {}): Promise<MigrationListResponse> {
    return this.client.request<MigrationListResponse>('GET', '/migrations', { params });
  }

  /** Create an import (a `draft`), optionally with its CSV files. */
  async create(params: CreateMigrationParams): Promise<MigrationJob> {
    return this.client.request<MigrationJob>('POST', '/migrations', { body: params });
  }

  /** An import's status and progress. */
  async get(id: string): Promise<MigrationJob> {
    return this.client.request<MigrationJob>('GET', `/migrations/${seg(id)}`);
  }

  /** Add (or replace) a CSV export of one kind. */
  async addFile(id: string, params: MigrationFileInput): Promise<MigrationFileResult> {
    return this.client.request<MigrationFileResult>('POST', `/migrations/${seg(id)}/files`, {
      body: params,
    });
  }

  /** Fix the column mapping of a file (field → CSV header, null = not mapped). */
  async updateMapping(
    id: string,
    kind: MigrationKind,
    mapping: Record<string, string | null>
  ): Promise<MigrationFileResult> {
    return this.client.request<MigrationFileResult>(
      'PUT',
      `/migrations/${seg(id)}/files/${seg(kind)}/mapping`,
      { body: { mapping } }
    );
  }

  /** Remove a file. */
  async removeFile(id: string, kind: MigrationKind): Promise<MigrationJob> {
    return this.client.request<MigrationJob>('DELETE', `/migrations/${seg(id)}/files/${seg(kind)}`);
  }

  /** Preview a file's rows and their errors. */
  async rows(id: string, params: ListMigrationRowsParams): Promise<MigrationRowsPage> {
    return this.client.request<MigrationRowsPage>('GET', `/migrations/${seg(id)}/rows`, { params });
  }

  /** Pull from the other platform with your API token instead of CSV files. */
  async connect(id: string, token: string): Promise<MigrationConnectResult> {
    return this.client.request<MigrationConnectResult>('POST', `/migrations/${seg(id)}/connect`, {
      body: { token },
    });
  }

  /** Count what the import would create, skip and refuse. */
  async dryRun(id: string): Promise<MigrationDryRun> {
    return this.client.request<MigrationDryRun>('POST', `/migrations/${seg(id)}/dry-run`);
  }

  /** Start the import (it runs in the background; poll `get()`). */
  async start(id: string): Promise<MigrationJob> {
    return this.client.request<MigrationJob>('POST', `/migrations/${seg(id)}/start`);
  }

  /** Cancel an import (rows already imported stay). */
  async cancel(id: string): Promise<MigrationJob> {
    return this.client.request<MigrationJob>('POST', `/migrations/${seg(id)}/cancel`);
  }

  /** What an import created, skipped and could not import. */
  async report(id: string): Promise<MigrationReport> {
    return this.client.request<MigrationReport>('GET', `/migrations/${seg(id)}/report`);
  }

  /** Every row problem as CSV text. */
  async errorsCsv(id: string): Promise<string> {
    return this.client.request<string>('GET', `/migrations/${seg(id)}/errors.csv`, {
      responseType: 'text',
    });
  }
}

/** Global search (⌘K): one query across the store, grouped by record type. */
class SearchResource {
  constructor(private client: Pocketsflow) {}

  /**
   * Search orders, customers, products (and subscription offers), subscribers
   * and discounts at once. `types` narrows it, `limit` is hits per type
   * (1-20, default 5). A pk_test_ key searches test data, pk_live_ live data.
   */
  async query(q: string, params: SearchParams = {}): Promise<SearchResponse> {
    const { types, limit } = params;
    return this.client.request<SearchResponse>('GET', '/search', {
      params: { q, types: types?.length ? types.join(',') : undefined, limit },
    });
  }
}

/**
 * Pocketsflow Penny 1, a small open decision model: one typed question about
 * a situation, answered with a calibrated confidence. 1,000 free decisions
 * per account per calendar month (UTC), then prepaid credits.
 */
class PennyResource {
  constructor(private client: Pocketsflow) {}

  /**
   * Ask Penny one question about `state`. `auto: true` means the confidence
   * is high enough to act without a person. Uses one free decision (or one
   * credit once they are used up); failed answers are never counted. A 402
   * `penny_credits_exhausted` throws a `PocketsflowError` whose `body.buy_url`
   * is a checkout link for more credits (when they are on sale).
   */
  async decide(params: PennyDecideParams): Promise<PennyDecision> {
    return this.client.request<PennyDecision>('POST', '/v1/penny/decide', { body: params });
  }

  /** Free decisions used and left this month, credits left and a link to buy more. */
  async usage(): Promise<PennyUsage> {
    return this.client.request<PennyUsage>('GET', '/v1/penny/usage');
  }
}

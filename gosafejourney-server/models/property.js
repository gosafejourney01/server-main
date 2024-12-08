import mongoose, { Schema } from 'mongoose';

const amenitiesSchema = mongoose.Schema({
  ac: Boolean,
  wifi: Boolean,
  kitchen: Boolean,
  tv: Boolean,
  pool: Boolean,
  hotTub: Boolean,
  view: Boolean,
  sofabed: Boolean,
  carpeting: Boolean,
  firespace: Boolean,
  heating: Boolean,
  desk: Boolean,
  vaccum: Boolean,
  soundproof: Boolean,
  iron: Boolean,
  wardrobe: Boolean,
  toiletpaper: Boolean,
  shower: Boolean,
  slippers: Boolean,
  spa: Boolean,
  computer: Boolean,
  gameconsole: Boolean,
  laptop: Boolean,
  ipad: Boolean,
  tea: Boolean,
  minibar: Boolean,
  microwave: Boolean,
  refrigerator: Boolean,
  kitchenette: Boolean,
  towels: Boolean,
  alarm: Boolean,
  lounge: Boolean,
  laundary: Boolean,
  ev: Boolean,
  balcony: Boolean,
  terrace: Boolean,
  garden: Boolean,
  cityview: Boolean,
  oceanview: Boolean,
  elevator: Boolean,
  wheelchair: Boolean,
  babysafety: Boolean,
  games: Boolean,
  books: Boolean,
});


const reviewSchema = mongoose.Schema({
  rating: Number,
  feedback: String,
  reviewer: {
    type: Schema.Types.ObjectId,
    ref: "User"
  },
  reviewDate: {
    type: Date,
    default: new Date(),
  },
});

const propertySchema = mongoose.Schema({
  propertyName: String,
  propertyType: String,
  rating: String,
  propertyContactName: String,
  ownerId: {
    type: Schema.Types.ObjectId,
    ref: "User"
  },
  propertyContactName: String,
  phone: String,
  alternatePhone: String,
  iscompanyGroup: Boolean,
  companyGroupName: String,
  streetAddress: String,
  address: String,
  city: String,
  pincode: String,
  about: String,
  noGuests: Number,
  noBathrooms: Number,
  isBreakfastProvided: Boolean,
  isParkingProvided: String,
  isSmokingAlllowed: Boolean,
  arePetsAllowed: Boolean,
  areChildrenAllowed: Boolean,
  arePartiesAllowed: Boolean,
  isOpenForBooking: Boolean,
  isApproved: {
    type: Boolean,
    default: false
  },
  checkInTime: {
    type: Date,
    default: new Date()
  },
  checkOutTime: {
    type: Date,
    default: new Date()
  },
  amenities: amenitiesSchema,
  isProfileVerified: {
    type: Boolean,
    default: false
  },
  rooms: [{ type: Schema.Types.ObjectId, ref: "Room" }],
  propertyImages: [String],
  isPanPorH: {
    type: Boolean,
    default: false
  },
  isGst: {
    type: Boolean,
    default: false
  },
  cancellationDays: Number,
  cancellationHours: String,
  tradeName: String,
  aadhar: String,
  gstin: String,
  pan: String,
  commissionName: String,
  isAddressSame: {
    type: Boolean,
    default: false
  },
  reviews: [reviewSchema],
  totalIncome: {
    type: Number,
    default: 0
  },
  income: {
    1: {
      type: Number,
      default: 0
    },
    2: {
      type: Number,
      default: 0
    },
    3: {
      type: Number,
      default: 0
    },
    4: {
      type: Number,
      default: 0
    },
    5: {
      type: Number,
      default: 0
    },
    6: {
      type: Number,
      default: 0
    },
    7: {
      type: Number,
      default: 0
    },
    8: {
      type: Number,
      default: 0
    },
    9: {
      type: Number,
      default: 0
    },
    10: {
      type: Number,
      default: 0
    },
    11: {
      type: Number,
      default: 0
    },
    12: {
      type: Number,
      default: 0
    }
  },
  propertyBookings: [{ type: Schema.Types.ObjectId, ref: "PropertyBooking" }],
  isOpenNow: {
    type: Boolean,
    default: false
  },
  accountNumber: {
    type: String,
    default: ""
  },
  ifscCode: {
    type: String,
    default: ""
  },
  accountHolderName: {
    type: String,
    default: ""
  },
  commission: {
    type: Number,
    default: 0
  },
  file: String,
},
  {
    timestamps: true,
  });

const Property = mongoose.model('Property', propertySchema);

export default Property;
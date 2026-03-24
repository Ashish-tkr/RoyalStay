import { useState, useEffect } from 'react';
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { format, differenceInDays } from "date-fns";
import { Calendar as CalendarIcon, Clock, Loader2 } from "lucide-react";
import { Calendar } from "@/components/ui/calendar";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { DateRange } from "react-day-picker";

// Define the types for apartment and flat
interface FlatType {
  _id?: string;
  type: "Single" | "1BHK" | "2BHK" | "3BHK";
  title: string;
  description?: string;
  price: number;
  baseprice?: number;
  size?: string;
  maxOccupancy?: number;
  bedrooms?: number;
  bathrooms?: number;
  images: string[];
  features: string[];
  amenities: string[];
  rating?: number;
  reviews?: number;
}

interface Apartment {
  _id?: string;
  name: string;
  location: string;
  coverImage: string;
  amenities: string[];
  flats: FlatType[];
  rating: number;
  reviews: number;
  hasRestaurant: boolean;
  hasGym: boolean;
  hasPool?: boolean;
  hasSpa?: boolean;
  createdAt?: Date;
  updatedAt?: Date;
  __v: number;
  minPrice?: number;
  minBasePrice?: number;
  cheapestFlat?: FlatType;
}

// Define form schema with validation
const formSchema = z.object({
  firstName: z.string().min(2, {
    message: "First name must be at least 2 characters.",
  }),
  lastName: z.string().min(2, {
    message: "Last name must be at least 2 characters.",
  }),
  email: z.string().email({
    message: "Please enter a valid email address.",
  }),
  phone: z.string().min(10, {
    message: "Phone number must be at least 10 digits.",
  }),
  address: z.string().min(10, {
    message: "Address must be at least 10 characters.",
  }),
  city: z.string().min(2, {
    message: "City is required.",
  }),
  state: z.string().min(2, {
    message: "State is required.",
  }),
  zipCode: z.string().min(5, {
    message: "ZIP code must be at least 5 characters.",
  }),
  adults: z.coerce.number().min(1, {
    message: "At least 1 adult is required.",
  }).max(10, {
    message: "Maximum 10 adults allowed.",
  }),
  children: z.coerce.number().min(0, {
    message: "Children count cannot be negative.",
  }).max(10, {
    message: "Maximum 10 children allowed.",
  }),
  arrivalTime: z.string().min(1, {
    message: "Please select an estimated arrival time.",
  }),
  specialRequests: z.string().optional(),
});

interface BookingFormProps {
  onSubmit: (data: BookingFormValues & { dateRange: DateRange | undefined }) => void;
  onCancel?: () => void;
  propertyName?: string;
  initialDateRange?: DateRange;
  className?: string;
  apartment?: Apartment | null;
  flat?: FlatType | null;
  formData?: (BookingFormValues & { dateRange: DateRange | undefined }) | null;
  setFormData?: (data: (BookingFormValues & { dateRange: DateRange | undefined }) | null) => void;
  setStep?: (step: string) => void;
}

export type BookingFormValues = z.infer<typeof formSchema>;

export function BookingForm({ 
  onSubmit, 
  onCancel, 
  propertyName, 
  initialDateRange,
  className,
  apartment,
  flat,
  formData,
  setFormData,
  setStep
}: BookingFormProps) {
  const [dateRange, setDateRange] = useState<DateRange | undefined>(
    formData?.dateRange || initialDateRange || {
      from: new Date(),
      to: undefined,
    }
  );
  const [pricing, setPricing] = useState<{
    totalDays: number;
    basePrice: number;
    subtotal: number;
    taxes: number;
    serviceFee: number;
    finalAmount: number;
  } | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Calculate pricing when date range or flat changes
  useEffect(() => {
    if (flat && dateRange?.from && dateRange?.to) {
      const totalDays = differenceInDays(dateRange.to, dateRange.from);
      const basePrice = flat.price;
      const subtotal = basePrice * totalDays;
      const taxes = +(subtotal * 0.18).toFixed(2); // 18% GST
      const serviceFee = +(subtotal * 0.05).toFixed(2); // 5% service fee
      const finalAmount = +(subtotal + taxes + serviceFee).toFixed(2);

      setPricing({
        totalDays,
        basePrice,
        subtotal,
        taxes,
        serviceFee,
        finalAmount
      });
    } else {
      setPricing(null);
    }
  }, [dateRange, flat]);

  // Generate time slots for arrival time
  const timeSlots = [
    "Early Morning (6:00 AM - 9:00 AM)",
    "Morning (9:00 AM - 12:00 PM)",
    "Afternoon (12:00 PM - 3:00 PM)",
    "Evening (3:00 PM - 6:00 PM)",
    "Night (6:00 PM - 9:00 PM)",
    "Late Night (9:00 PM - 12:00 AM)",
  ];

  // Initialize form with react-hook-form and zod validation
  const form = useForm<BookingFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      firstName: formData?.firstName || "",
      lastName: formData?.lastName || "",
      email: formData?.email || "",
      phone: formData?.phone || "",
      address: formData?.address || "",
      city: formData?.city || "",
      state: formData?.state || "",
      zipCode: formData?.zipCode || "",
      adults: formData?.adults || 1,
      children: formData?.children || 0,
      arrivalTime: formData?.arrivalTime || "",
      specialRequests: formData?.specialRequests || "",
    },
  });

  // Handle form submission - just store data and move to confirmation
  function handleSubmit(values: BookingFormValues) {
    if (!dateRange?.from || !dateRange?.to) {
      return; // Don't submit if date range is incomplete
    }
    
    setIsSubmitting(true);
    
    const formDataWithDates = { ...values, dateRange };
    
    // Store form data using the prop setter if available
    if (setFormData) {
      setFormData(formDataWithDates);
    }
    
    // Call the parent onSubmit
    onSubmit(formDataWithDates);
    
    setIsSubmitting(false);
  }

  return (
    <div className={cn("space-y-6", className)}>
      {propertyName && (
        <div className="text-center mb-6">
          <h2 className="text-2xl font-bold gradient-text">Book {propertyName}</h2>
          <p className="text-gray-300">Complete your booking details below</p>
        </div>
      )}

      {/* Flat Information */}
      {flat && (
        <div className="bg-luxury-800/50 border border-luxury-700 rounded-lg p-4">
          <h3 className="text-lg font-semibold text-royal-300 mb-2">Selected Flat</h3>
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <span className="text-gray-400">Type:</span>
              <span className="text-white ml-2">{flat.type}</span>
            </div>
            <div>
              <span className="text-gray-400">Title:</span>
              <span className="text-white ml-2">{flat.title}</span>
            </div>
            <div>
              <span className="text-gray-400">Price:</span>
              <span className="text-white ml-2">₹{flat.price.toLocaleString()}/night</span>
            </div>
            <div>
              <span className="text-gray-400">Max Guests:</span>
              <span className="text-white ml-2">{flat.maxOccupancy || 2}</span>
            </div>
          </div>
        </div>
      )}

      <Form {...form}>
        <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
          {/* Date Range Selection */}
          <div className="space-y-2">
            <FormLabel className="text-royal-300 font-medium">Check-in & Check-out Dates</FormLabel>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  id="date"
                  variant="outline"
                  className={cn(
                    "w-full justify-start text-left font-normal border-luxury-700 text-gray-300 hover:bg-luxury-800",
                    !dateRange && "text-muted-foreground"
                  )}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {dateRange?.from ? (
                    dateRange.to ? (
                      <>
                        {format(dateRange.from, "LLL dd, y")} - {format(dateRange.to, "LLL dd, y")}
                      </>
                    ) : (
                      format(dateRange.from, "LLL dd, y")
                    )
                  ) : (
                    <span>Pick check-in and check-out dates</span>
                  )}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0 bg-luxury-800 border-luxury-700" align="start">
                <Calendar
                  initialFocus
                  mode="range"
                  defaultMonth={dateRange?.from}
                  selected={dateRange}
                  onSelect={setDateRange}
                  numberOfMonths={2}
                  disabled={{ before: new Date() }}
                  className="bg-luxury-800 text-white"
                />
              </PopoverContent>
            </Popover>
            {!dateRange?.to && dateRange?.from && (
              <p className="text-sm text-red-400">Please select a check-out date</p>
            )}
          </div>

          {/* Pricing Summary */}
          {pricing && (
            <div className="bg-luxury-800/50 border border-luxury-700 rounded-lg p-4">
              <h3 className="text-lg font-semibold text-royal-300 mb-2">Pricing Summary</h3>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-400">Base Price ({pricing.totalDays} nights):</span>
                  <span className="text-white">₹{pricing.subtotal.toLocaleString()}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">GST (18%):</span>
                  <span className="text-white">₹{pricing.taxes.toLocaleString()}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Service Fee (5%):</span>
                  <span className="text-white">₹{pricing.serviceFee.toLocaleString()}</span>
                </div>
                <div className="flex justify-between border-t border-luxury-700 pt-2 mt-2">
                  <span className="text-gray-400 font-semibold">Total Amount:</span>
                  <span className="text-white font-bold">₹{pricing.finalAmount.toLocaleString()}</span>
                </div>
              </div>
            </div>
          )}

          {/* Guest Details Section */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-royal-300 border-b border-luxury-700 pb-2">
              Guest Details
            </h3>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* First Name */}
              <FormField
                control={form.control}
                name="firstName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>First Name</FormLabel>
                    <FormControl>
                      <Input 
                        placeholder="Enter first name" 
                        {...field} 
                        className="bg-luxury-800 border-luxury-700 text-white placeholder:text-gray-400"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Last Name */}
              <FormField
                control={form.control}
                name="lastName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Last Name</FormLabel>
                    <FormControl>
                      <Input 
                        placeholder="Enter last name" 
                        {...field} 
                        className="bg-luxury-800 border-luxury-700 text-white placeholder:text-gray-400"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {/* Number of Adults */}
              <FormField
                control={form.control}
                name="adults"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Number of Adults</FormLabel>
                    <FormControl>
                      <Input 
                        type="number" 
                        min={1}
                        max={10}
                        {...field} 
                        className="bg-luxury-800 border-luxury-700 text-white placeholder:text-gray-400"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Number of Children */}
              <FormField
                control={form.control}
                name="children"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Number of Children</FormLabel>
                    <FormControl>
                      <Input 
                        type="number" 
                        min={0}
                        max={10}
                        {...field} 
                        className="bg-luxury-800 border-luxury-700 text-white placeholder:text-gray-400"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Estimated Arrival Time */}
              <FormField
                control={form.control}
                name="arrivalTime"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Estimated Arrival Time</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger className="bg-luxury-800 border-luxury-700 text-white">
                          <SelectValue placeholder="Select arrival time" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent className="bg-luxury-800 border-luxury-700">
                        {timeSlots.map((slot) => (
                          <SelectItem key={slot} value={slot} className="text-white hover:bg-luxury-700">
                            {slot}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </div>

          {/* Contact Details Section */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-royal-300 border-b border-luxury-700 pb-2">
              Contact Details
            </h3>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Email Address */}
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email Address</FormLabel>
                    <FormControl>
                      <Input 
                        type="email" 
                        placeholder="Enter email address" 
                        {...field} 
                        className="bg-luxury-800 border-luxury-700 text-white placeholder:text-gray-400"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Phone Number */}
              <FormField
                control={form.control}
                name="phone"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Phone Number</FormLabel>
                    <FormControl>
                      <Input 
                        type="tel" 
                        placeholder="Enter phone number" 
                        {...field} 
                        className="bg-luxury-800 border-luxury-700 text-white placeholder:text-gray-400"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            {/* Address */}
            <FormField
              control={form.control}
              name="address"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Street Address</FormLabel>
                  <FormControl>
                    <Input 
                      placeholder="Enter street address" 
                      {...field} 
                      className="bg-luxury-800 border-luxury-700 text-white placeholder:text-gray-400"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {/* City */}
              <FormField
                control={form.control}
                name="city"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>City</FormLabel>
                    <FormControl>
                      <Input 
                        placeholder="Enter city" 
                        {...field} 
                        className="bg-luxury-800 border-luxury-700 text-white placeholder:text-gray-400"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* State */}
              <FormField
                control={form.control}
                name="state"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>State</FormLabel>
                    <FormControl>
                      <Input 
                        placeholder="Enter state" 
                        {...field} 
                        className="bg-luxury-800 border-luxury-700 text-white placeholder:text-gray-400"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* ZIP Code */}
              <FormField
                control={form.control}
                name="zipCode"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>ZIP Code</FormLabel>
                    <FormControl>
                      <Input 
                        placeholder="Enter ZIP code" 
                        {...field} 
                        className="bg-luxury-800 border-luxury-700 text-white placeholder:text-gray-400"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </div>

          {/* Special Requests */}
          <FormField
            control={form.control}
            name="specialRequests"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Special Requests (Optional)</FormLabel>
                <FormControl>
                  <Textarea 
                    placeholder="Any special requests, dietary requirements, or additional information?" 
                    {...field} 
                    className="bg-luxury-800 border-luxury-700 text-white placeholder:text-gray-400 min-h-[100px]"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <div className="flex justify-end gap-2 pt-4 border-t border-luxury-700">
            {onCancel && (
              <Button 
                type="button" 
                variant="outline" 
                onClick={onCancel}
                className="border-gray-600 text-gray-300"
                disabled={isSubmitting}
              >
                Cancel
              </Button>
            )}
            <Button 
              type="submit"
              disabled={!dateRange?.from || !dateRange?.to || isSubmitting}
              className="bg-royal-gradient hover:shadow-lg hover:shadow-royal-500/25"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Processing...
                </>
              ) : (
                'Preview Booking'
              )}
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
}
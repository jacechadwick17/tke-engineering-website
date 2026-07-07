import { useState, useRef, useEffect } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { toast, Toaster } from 'sonner';
import {
  Mail,
  Phone,
  MapPin,
  Send,
  Heart,
  Clock,
  Users,
  PiggyBank,
  Briefcase,
  CheckCircle,
} from 'lucide-react';
import { useJobs, useSettings } from '@/hooks/useContent';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';

gsap.registerPlugin(ScrollTrigger);

const departments = [
  'Estimating',
  'Mechanical',
  'Electrical',
  'Civil',
  'Structural',
  'Architectural',
];

const benefits = [
  { name: 'Health Insurance', icon: Heart },
  { name: 'Paid Time Off', icon: Clock },
  { name: 'Employee Assistance Programs', icon: Users },
  { name: 'Retirement Savings', icon: PiggyBank },
];

export default function CareersContact() {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    message: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [selectedJob, setSelectedJob] = useState<string | null>(null);

  const sectionRef = useRef<HTMLElement>(null);
  const leftRef = useRef<HTMLDivElement>(null);
  const rightRef = useRef<HTMLDivElement>(null);

  const { jobs, loading: jobsLoading } = useJobs();
  const { settings, loading: settingsLoading } = useSettings();

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Left column animation
      gsap.fromTo(
        leftRef.current,
        { opacity: 0, x: -50 },
        {
          opacity: 1,
          x: 0,
          duration: 1,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: sectionRef.current,
            start: 'top 70%',
            toggleActions: 'play none none reverse',
          },
        }
      );

      // Right column animation
      gsap.fromTo(
        rightRef.current,
        { opacity: 0, x: 50 },
        {
          opacity: 1,
          x: 0,
          duration: 1,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: sectionRef.current,
            start: 'top 70%',
            toggleActions: 'play none none reverse',
          },
        }
      );
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1500));

    setIsSubmitting(false);
    toast.success("Message sent! We'll get back to you soon.");
    
    setFormData({
      firstName: '',
      lastName: '',
      email: '',
      phone: '',
      message: '',
    });
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const selectedJobData = jobs.find((j) => j.slug === selectedJob);

  if (jobsLoading || settingsLoading) {
    return (
      <section
        id="careers"
        ref={sectionRef}
        className="relative py-20 md:py-32 bg-[#0f0f0f]"
      >
        <div className="max-w-7xl mx-auto px-4 md:px-8">
          <div className="animate-pulse">
            <div className="h-10 bg-white/10 rounded w-1/3 mb-8" />
            <div className="h-[400px] bg-white/5 rounded-xl" />
          </div>
        </div>
      </section>
    );
  }

  return (
    <section
      id="careers"
      ref={sectionRef}
      className="relative py-20 md:py-32 bg-[#0f0f0f]"
    >
      {/* Toast Notification Container with Dark Theme applied */}
      <Toaster position="top-right" richColors theme="dark" />

      {/* Diagonal Divider Background */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            'linear-gradient(105deg, #0f0f0f 50%, #1a1a1a 50%)',
        }}
      />

      <div className="relative max-w-7xl mx-auto px-4 md:px-8">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-20">
          {/* Left Column - Careers */}
          <div id="contact" ref={leftRef} className="space-y-10">
            {/* Careers Header */}
            <div>
              <h2 className="section-title">Careers</h2>
              <p className="section-subtitle">
                Join our team of engineering professionals
              </p>
            </div>

            {/* Join Our Team */}
            <div className="bg-[#1a1a1a] rounded-xl p-6 border border-white/5">
              <h3 className="text-xl font-bold text-white mb-4">
                JOIN OUR TEAM
              </h3>
              <p className="text-[#888888] text-sm leading-relaxed mb-6">
                TKE Engineering & Design is always looking for bright,
                enthusiastic people to work with us. TKE offers competitive pay,
                great benefits and career growth opportunities. We mentor our
                team members through education and on-the-job experience. We
                encourage participation and involvement at all levels of our
                business.
              </p>

              {/* Departments */}
              <div className="mb-6">
                <h4 className="text-sm font-semibold text-[#00A0A0] mb-3 uppercase tracking-wider">
                  Departments
                </h4>
                <div className="flex flex-wrap gap-2">
                  {departments.map((dept) => (
                    <span
                      key={dept}
                      className="px-3 py-1 bg-[#00A0A0]/10 text-[#00A0A0] text-xs rounded-full"
                    >
                      {dept}
                    </span>
                  ))}
                </div>
              </div>

              {/* Benefits */}
              <div>
                <h4 className="text-sm font-semibold text-[#00A0A0] mb-3 uppercase tracking-wider">
                  Benefits Include
                </h4>
                <div className="grid grid-cols-2 gap-3">
                  {benefits.map((benefit) => {
                    const Icon = benefit.icon;
                    return (
                      <div
                        key={benefit.name}
                        className="flex items-center gap-2 text-[#888888] text-sm"
                      >
                        <Icon size={14} className="text-[#00A0A0]" />
                        {benefit.name}
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* Job Openings */}
            <div>
              <h3 className="text-xl font-bold text-white mb-4">
                Available Career Openings
              </h3>
              {jobs.length === 0 ? (
                <div className="bg-[#1a1a1a] rounded-xl p-6 border border-white/5">
                  <p className="text-[#888888] text-sm">
                    No open positions at this time. Please check back later or send your resume for future opportunities.
                  </p>
                </div>
              ) : (
                jobs.map((job) => (
                  <div
                    key={job.slug}
                    className="bg-[#1a1a1a] rounded-xl p-6 border border-white/5 mb-4"
                  >
                    <div className="flex items-start gap-3 mb-4">
                      <Briefcase
                        size={20}
                        className="text-[#00A0A0] mt-1 flex-shrink-0"
                      />
                      <div>
                        <h4 className="text-lg font-bold text-white">
                          {job.title}
                        </h4>
                        <p className="text-sm text-[#888888]">{job.location}</p>
                        <span className="text-xs text-[#00A0A0] bg-[#00A0A0]/10 px-2 py-0.5 rounded mt-1 inline-block">
                          {job.department}
                        </span>
                      </div>
                    </div>

                    <p className="text-[#888888] text-sm mb-4 line-clamp-3">
                      {job.description}
                    </p>

                    <div className="flex gap-3">
                      <button
                        onClick={() => setSelectedJob(job.slug)}
                        className="text-sm text-[#00A0A0] hover:text-[#00CCCC] transition-colors font-medium"
                      >
                        View Details
                      </button>
                      <a
                        href={`mailto:${settings?.resumeEmail}`}
                        className="inline-flex items-center gap-2 text-[#00A0A0] hover:text-[#00CCCC] transition-colors duration-300 text-sm font-medium"
                      >
                        <Mail size={14} />
                        Apply Now
                      </a>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Right Column - Contact */}
          <div ref={rightRef} className="space-y-10">
            {/* Contact Header */}
            <div>
              <h2 className="section-title">Contact Us</h2>
              <p className="section-subtitle">
                Get in touch with our engineering team
              </p>
            </div>

            {/* Contact Info */}
            <div className="bg-[#1a1a1a] rounded-xl p-6 border border-white/5 space-y-4">
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 bg-[#00A0A0]/10 rounded-lg flex items-center justify-center">
                  <MapPin size={18} className="text-[#00A0A0]" />
                </div>
                <div>
                  <p className="text-sm text-[#888888]">Address</p>
                  <p className="text-white text-sm">
                    {settings?.address1}
                    <br />
                    {settings?.address2}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-4">
                <div className="w-10 h-10 bg-[#00A0A0]/10 rounded-lg flex items-center justify-center">
                  <Mail size={18} className="text-[#00A0A0]" />
                </div>
                <div>
                  <p className="text-sm text-[#888888]">Email</p>
                  <a
                    href={`mailto:${settings?.email}`}
                    className="text-white text-sm hover:text-[#00A0A0] transition-colors"
                  >
                    {settings?.email}
                  </a>
                </div>
              </div>

              <div className="flex items-center gap-4">
                <div className="w-10 h-10 bg-[#00A0A0]/10 rounded-lg flex items-center justify-center">
                  <Phone size={18} className="text-[#00A0A0]" />
                </div>
                <div>
                  <p className="text-sm text-[#888888]">Phone</p>
                  <a
                    href={`tel:${settings?.phone?.replace(/\./g, '')}`}
                    className="text-white text-sm hover:text-[#00A0A0] transition-colors"
                  >
                    {settings?.phone}
                  </a>
                </div>
              </div>
            </div>

            {/* Contact Form */}
            <div className="bg-[#1a1a1a] rounded-xl p-6 border border-white/5">
              <h3 className="text-lg font-bold text-white mb-4">
                Send Us a Message
              </h3>

              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm text-[#888888] mb-1">
                      First Name <span className="text-[#c94e4e]">*</span>
                    </label>
                    <input
                      type="text"
                      name="firstName"
                      value={formData.firstName}
                      onChange={handleChange}
                      required
                      className="w-full px-4 py-3 bg-[#0f0f0f] border border-white/10 rounded-lg text-white text-sm focus:outline-none focus:border-[#00A0A0] transition-colors"
                      placeholder="John"
                    />
                  </div>
                  <div>
                    <label className="block text-sm text-[#888888] mb-1">
                      Last Name <span className="text-[#c94e4e]">*</span>
                    </label>
                    <input
                      type="text"
                      name="lastName"
                      value={formData.lastName}
                      onChange={handleChange}
                      required
                      className="w-full px-4 py-3 bg-[#0f0f0f] border border-white/10 rounded-lg text-white text-sm focus:outline-none focus:border-[#00A0A0] transition-colors"
                      placeholder="Doe"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm text-[#888888] mb-1">
                    Email <span className="text-[#c94e4e]">*</span>
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-3 bg-[#0f0f0f] border border-white/10 rounded-lg text-white text-sm focus:outline-none focus:border-[#00A0A0] transition-colors"
                    placeholder="john@example.com"
                  />
                </div>

                <div>
                  <label className="block text-sm text-[#888888] mb-1">
                    Phone
                  </label>
                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    className="w-full px-4 py-3 bg-[#0f0f0f] border border-white/10 rounded-lg text-white text-sm focus:outline-none focus:border-[#00A0A0] transition-colors"
                    placeholder="(555) 123-4567"
                  />
                </div>

                <div>
                  <label className="block text-sm text-[#888888] mb-1">
                    Message <span className="text-[#c94e4e]">*</span>
                  </label>
                  <textarea
                    name="message"
                    value={formData.message}
                    onChange={handleChange}
                    required
                    rows={4}
                    className="w-full px-4 py-3 bg-[#0f0f0f] border border-white/10 rounded-lg text-white text-sm focus:outline-none focus:border-[#00A0A0] transition-colors resize-none"
                    placeholder="How can we help you?"
                  />
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full btn-primary flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isSubmitting ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      Sending...
                    </>
                  ) : (
                    <>
                      <Send size={16} />
                      Send Message
                    </>
                  )}
                </button>
              </form>
            </div>

            {/* Map Embed */}
            <div className="rounded-xl overflow-hidden border border-white/5 h-[200px]">
              <iframe
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3456.789!2d-95.573673!3d29.987799!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zMjnCsDU5JzE2LjEiTiA5NcKwMzQnMjUuMiJX!5e0!3m2!1sen!2sus!4v1234567890"
                width="100%"
                height="100%"
                style={{ border: 0, filter: 'grayscale(100%) invert(92%)' }}
                allowFullScreen
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                title="TKE Engineering Location"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Job Detail Modal */}
      <Dialog
        open={!!selectedJob}
        onOpenChange={() => setSelectedJob(null)}
      >
        <DialogContent className="max-w-2xl bg-[#1a1a1a] border-white/10 text-white max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-2xl font-bold text-white">
              {selectedJobData?.title}
            </DialogTitle>
          </DialogHeader>
          {selectedJobData && (
            <div className="mt-4 space-y-4">
              <div className="flex items-center gap-4 text-sm text-[#888888]">
                <span>{selectedJobData.location}</span>
                <span className="text-[#00A0A0] bg-[#00A0A0]/10 px-2 py-0.5 rounded">
                  {selectedJobData.department}
                </span>
              </div>
              
              <div>
                <h4 className="text-sm font-semibold text-white mb-2">Description</h4>
                <p className="text-[#888888] text-sm leading-relaxed">
                  {selectedJobData.description}
                </p>
              </div>

              <div>
                <h4 className="text-sm font-semibold text-white mb-2">Requirements</h4>
                <ul className="space-y-2">
                  {selectedJobData.requirements.map((req, i) => (
                    <li
                      key={i}
                      className="flex items-center gap-2 text-[#888888] text-sm"
                    >
                      <CheckCircle size={14} className="text-[#00A0A0] flex-shrink-0" />
                      {req}
                    </li>
                  ))}
                </ul>
              </div>

              <a
                href={`mailto:${settings?.resumeEmail}`}
                className="inline-flex items-center gap-2 btn-primary mt-4"
              >
                <Mail size={16} />
                Apply Now
              </a>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </section>
  );
}

import { useState, useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { MapPin, Phone, Mail, Clock, Send, CheckCircle, Briefcase, ChevronRight } from 'lucide-react';
import { useJobs, useSettings } from '../hooks/useContent';

gsap.registerPlugin(ScrollTrigger);

export default function CareersContact() {
  const { jobs, loading: jobsLoading } = useJobs();
  const { settings } = useSettings();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    subject: '',
    message: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [expandedJob, setExpandedJob] = useState<string | null>(null);

  const sectionRef = useRef<HTMLElement>(null);
  const careersRef = useRef<HTMLDivElement>(null);
  const contactRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(
        careersRef.current,
        { opacity: 0, x: -50 },
        {
          opacity: 1,
          x: 0,
          duration: 0.8,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: sectionRef.current,
            start: 'top 70%',
          },
        }
      );

      gsap.fromTo(
        contactRef.current,
        { opacity: 0, x: 50 },
        {
          opacity: 1,
          x: 0,
          duration: 0.8,
          delay: 0.2,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: sectionRef.current,
            start: 'top 70%',
          },
        }
      );
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Simulate form submission
    await new Promise((resolve) => setTimeout(resolve, 1500));

    setIsSubmitting(false);
    setIsSubmitted(true);
    setFormData({ name: '', email: '', phone: '', subject: '', message: '' });

    // Reset success message after 5 seconds
    setTimeout(() => setIsSubmitted(false), 5000);
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const toggleJob = (jobId: string) => {
    setExpandedJob(expandedJob === jobId ? null : jobId);
  };

  const contactInfo = settings?.contact || {
    address: '123 Engineering Way, Industrial District, TX 75001',
    phone: '(555) 123-4567',
    email: 'info@tke-engineering.com',
    hours: 'Mon - Fri: 8:00 AM - 5:00 PM',
  };

  return (
    <section id="careers" ref={sectionRef} className="py-24 md:py-32 bg-[#f8f9fa]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-16">
          {/* Careers Column */}
          <div ref={careersRef}>
            <div className="mb-8">
              <h2 className="text-3xl md:text-4xl font-bold text-[#1a1a1a] mb-4">
                Join Our Team
              </h2>
              <p className="text-[#666666] text-lg">
                We're always looking for talented individuals who are passionate about engineering excellence.
              </p>
            </div>

            {/* Job Listings */}
            <div className="space-y-4">
              {jobsLoading ? (
                <div className="animate-pulse space-y-4">
                  {[1, 2, 3].map((i) => (
                    <div key={i} className="h-24 bg-gray-200 rounded-lg"></div>
                  ))}
                </div>
              ) : jobs.length === 0 ? (
                <div className="text-center py-8 bg-white rounded-lg shadow-sm">
                  <Briefcase className="w-12 h-12 text-[#009966] mx-auto mb-4" />
                  <p className="text-[#666666]">No open positions at this time.</p>
                  <p className="text-sm text-[#999999] mt-2">
                    Check back soon or send us your resume for future opportunities.
                  </p>
                </div>
              ) : (
                jobs.map((job) => (
                  <div
                    key={job.id}
                    className="bg-white rounded-lg shadow-sm border border-gray-100 overflow-hidden"
                  >
                    <button
                      onClick={() => toggleJob(job.id)}
                      className="w-full px-6 py-4 flex items-center justify-between text-left hover:bg-gray-50 transition-colors"
                    >
                      <div>
                        <h3 className="font-semibold text-[#1a1a1a]">{job.title}</h3>
                        <p className="text-sm text-[#666666]">
                          {job.department} • {job.location} • {job.type}
                        </p>
                      </div>
                      <ChevronRight
                        className={`w-5 h-5 text-[#009966] transition-transform ${
                          expandedJob === job.id ? 'rotate-90' : ''
                        }`}
                      />
                    </button>

                    {expandedJob === job.id && (
                      <div className="px-6 pb-6 border-t border-gray-100 pt-4">
                        <div
                          className="prose prose-sm max-w-none text-[#666666] mb-4"
                          dangerouslySetInnerHTML={{ __html: job.description }}
                        />
                        <a
                          href={`mailto:${contactInfo.email}?subject=Application for ${job.title}`}
                          className="inline-flex items-center gap-2 bg-[#009966] text-white px-4 py-2 rounded-lg font-medium hover:bg-[#007a52] transition-colors"
                        >
                          Apply Now
                          <Send className="w-4 h-4" />
                        </a>
                      </div>
                    )}
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Contact Column */}
          <div ref={contactRef} id="contact">
            <div className="mb-8">
              <h2 className="text-3xl md:text-4xl font-bold text-[#1a1a1a] mb-4">
                Contact Us
              </h2>
              <p className="text-[#666666] text-lg">
                Have a project in mind? Let's discuss how we can help bring your vision to life.
              </p>
            </div>

            {/* Contact Info Cards */}
            <div className="grid grid-cols-2 gap-4 mb-8">
              <div className="bg-white p-4 rounded-lg shadow-sm">
                <MapPin className="w-6 h-6 text-[#009966] mb-2" />
                <p className="text-sm text-[#666666]">{contactInfo.address}</p>
              </div>
              <div className="bg-white p-4 rounded-lg shadow-sm">
                <Phone className="w-6 h-6 text-[#009966] mb-2" />
                <p className="text-sm text-[#666666]">{contactInfo.phone}</p>
              </div>
              <div className="bg-white p-4 rounded-lg shadow-sm">
                <Mail className="w-6 h-6 text-[#009966] mb-2" />
                <p className="text-sm text-[#666666]">{contactInfo.email}</p>
              </div>
              <div className="bg-white p-4 rounded-lg shadow-sm">
                <Clock className="w-6 h-6 text-[#009966] mb-2" />
                <p className="text-sm text-[#666666]">{contactInfo.hours}</p>
              </div>
            </div>

            {/* Contact Form */}
            <form onSubmit={handleSubmit} className="bg-white p-6 rounded-lg shadow-sm">
              {isSubmitted ? (
                <div className="text-center py-8">
                  <CheckCircle className="w-16 h-16 text-[#009966] mx-auto mb-4" />
                  <h3 className="text-xl font-semibold text-[#1a1a1a] mb-2">
                    Message Sent!
                  </h3>
                  <p className="text-[#666666]">
                    Thank you for reaching out. We'll get back to you soon.
                  </p>
                </div>
              ) : (
                <>
                  <div className="grid md:grid-cols-2 gap-4 mb-4">
                    <div>
                      <label htmlFor="name" className="block text-sm font-medium text-[#333333] mb-1">
                        Name *
                      </label>
                      <input
                        type="text"
                        id="name"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        required
                        className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#009966] focus:border-transparent outline-none transition-all"
                        placeholder="Your name"
                      />
                    </div>
                    <div>
                      <label htmlFor="email" className="block text-sm font-medium text-[#333333] mb-1">
                        Email *
                      </label>
                      <input
                        type="email"
                        id="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        required
                        className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#009966] focus:border-transparent outline-none transition-all"
                        placeholder="your@email.com"
                      />
                    </div>
                  </div>

                  <div className="grid md:grid-cols-2 gap-4 mb-4">
                    <div>
                      <label htmlFor="phone" className="block text-sm font-medium text-[#333333] mb-1">
                        Phone
                      </label>
                      <input
                        type="tel"
                        id="phone"
                        name="phone"
                        value={formData.phone}
                        onChange={handleChange}
                        className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#009966] focus:border-transparent outline-none transition-all"
                        placeholder="(555) 123-4567"
                      />
                    </div>
                    <div>
                      <label htmlFor="subject" className="block text-sm font-medium text-[#333333] mb-1">
                        Subject *
                      </label>
                      <select
                        id="subject"
                        name="subject"
                        value={formData.subject}
                        onChange={handleChange}
                        required
                        className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#009966] focus:border-transparent outline-none transition-all"
                      >
                        <option value="">Select a subject</option>
                        <option value="general">General Inquiry</option>
                        <option value="project">Project Discussion</option>
                        <option value="quote">Request a Quote</option>
                        <option value="career">Career Opportunity</option>
                        <option value="other">Other</option>
                      </select>
                    </div>
                  </div>

                  <div className="mb-6">
                    <label htmlFor="message" className="block text-sm font-medium text-[#333333] mb-1">
                      Message *
                    </label>
                    <textarea
                      id="message"
                      name="message"
                      value={formData.message}
                      onChange={handleChange}
                      required
                      rows={4}
                      className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#009966] focus:border-transparent outline-none transition-all resize-none"
                      placeholder="Tell us about your project or inquiry..."
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full bg-[#009966] text-white py-3 rounded-lg font-semibold hover:bg-[#007a52] transition-colors flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed"
                  >
                    {isSubmitting ? (
                      <>
                        <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                        Sending...
                      </>
                    ) : (
                      <>
                        Send Message
                        <Send className="w-4 h-4" />
                      </>
                    )}
                  </button>
                </>
              )}
            </form>
          </div>
        </div>
      </div>
    </section>
  );
}
